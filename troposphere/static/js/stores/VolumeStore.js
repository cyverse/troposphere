define(function (require) {
    'use strict';

    //
    // Dependencies
    // ------------
    //

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Store = require('stores/Store'),
      Q = require('q'),
      VolumeCollection = require('collections/VolumeCollection'),
      Volume = require('models/Volume'),
      VolumeConstants = require('constants/VolumeConstants'),
      NotificationController = require('controllers/NotificationController'),
      IdentityStore = require('stores/IdentityStore'),
      VolumeAttachNotifications = require('components/notifications/VolumeAttachNotifications.react'),
      ProjectActions = require('actions/ProjectActions');


    //
    // Private variables
    //

    var _volumes = new VolumeCollection();
    var _isFetching = false;
    var validStates = ["available", "in-use", "error_deleting"];
    var pollingFrequency = 5*1000;
    var _pendingProjectVolumes = {};
    var _pendingRemovalProjectVolumes = {};

    //
    // CRUD Operations
    //

    var fetchVolumesFor = function (providerId, identityId) {
      var defer = Q.defer();

      var volumes = new VolumeCollection(null, {
        provider_id: providerId,
        identity_id: identityId
      });

      // make sure promise returns the right instances collection
      // for when this function is called multiple times
      (function(volumes, defer){
        volumes.fetch().done(function(){
          defer.resolve(volumes);
        });
      })(volumes, defer);

      return defer.promise;
    };

    var fetchVolumes = function (identities) {
      if(!_isFetching && identities) {
        _isFetching = true;

        // return an array of promises (one for each volume collection being fetched)
        var promises = identities.map(function (identity) {
          var providerId = identity.get('provider_id');
          var identityId = identity.get('id');
          return fetchVolumesFor(providerId, identityId);
        });

        // When all volume collections are fetched...
        Q.all(promises).done(function (volumeCollections) {
          // Combine results into a single volume collection
          var volumes = new VolumeCollection();
          for (var i = 0; i < volumeCollections.length; i++) {
            volumes.add(volumeCollections[i].toJSON());
          }

          // Start polling for any instances that are in transition states
          volumes.forEach(function(volume){
            if(validStates.indexOf(volume.get("status")) < 0){
              pollUntilBuildIsFinished(volume);
            }
          });

          // Save the results to local cache
          _isFetching = false;
          _volumes = volumes;
          VolumeStore.emitChange();
        });
      }
    };

    function update(volume){
      volume.save({name: volume.get('name')}, {patch: true}).done(function(){
        VolumeStore.emitChange();
      }).fail(function(){
        var failureMessage = "Error updating Volume " + volume.get('name') + ".";
        NotificationController.error(failureMessage);
        VolumeStore.emitChange();
      });
    }

    var detach = function(volume){
      volume.detach({
        success: function (model) {
          NotificationController.success("Success", "Volume was detached.  It is now available to attach to another instance or destroy.");
          VolumeStore.emitChange();
        },
        error: function (message, response) {
          NotificationController.error("Error", "Volume could not be detached");
          VolumeStore.emitChange();
        }
      });
    };

    var destroy = function(volume, options){
      options = options || {};

      volume.destroy({
        success: function (model) {
          if(options.afterDestroy) options.afterDestroy(volume);
          VolumeStore.emitChange();
        },
        error: function (message, response) {
          NotificationController.error("Error", "Volume could not be destroyed");
          if(options.afterDestroyError) options.afterDestroyError(volume);
          VolumeStore.emitChange();
        }
      });
    };

    var destroy_RemoveFromProject = function(volume, project){
      _pendingRemovalProjectVolumes[project.id] = _pendingRemovalProjectVolumes[project.id] || new VolumeCollection();
      _pendingRemovalProjectVolumes[project.id].add(volume);

      destroy(volume, {
        afterDestroy: function(instance){
          _pendingRemovalProjectVolumes[project.id].remove(volume);
          ProjectActions.removeItemFromProject(project, volume);
        },
        afterDestroyError: function(instance){
          _pendingRemovalProjectVolumes[project.id].remove(volume);
          //ProjectActions.addItemToProject(project, instance);
        }
      })
    };


    var attach = function(volume, instance, mountLocation){
      volume.attachTo(instance, mountLocation, {
        success: function (response) {
          var title = "Volume successfully attached";
          var successMessage = VolumeAttachNotifications.success();
          NotificationController.success(title, successMessage);
          VolumeStore.emitChange();
        },
        error: function (response) {
          var title = "Volume could not be attached";
          var errorMessage = VolumeAttachNotifications.error();
          NotificationController.error(title, errorMessage);
          VolumeStore.emitChange();
        }
      });
    };

    var create = function(volumeName, volumeSize, identity, options){
      options = options || {};

      var volume = new Volume({
        identity: {
          id: identity.id,
          provider: identity.get('provider_id')
        },
        name: volumeName,
        description: "",
        size: volumeSize
      });

      var params = {
        model_name: "volume",
        tags: "CF++"
      };

      if(options.afterCreate) options.afterCreate(volume);

      volume.save(params, {
        success: function (model) {
          if(options.afterSave) options.afterSave(volume);
          pollUntilBuildIsFinished(volume);
          VolumeStore.emitChange();
        },
        error: function (response) {
          NotificationController.error('Error', 'Volume could not be created');
          if(options.afterSaveError) options.afterSaveError(volume);
          _volumes.remove(volume);
          VolumeStore.emitChange();
        }
      });

      if(_volumes) {
        _volumes.add(volume)
      }else{
        console.error("_volumes not defined");
      }
    };

    var create_AddToProject = function(volumeName, volumeSize, identity, project){
      create(volumeName, volumeSize, identity, {
        afterCreate: function(volume){
          _pendingProjectVolumes[project.id] = _pendingProjectVolumes[project.id] || new VolumeCollection();
          _pendingProjectVolumes[project.id].add(volume);
        },
        afterSave: function(volume){
          _pendingProjectVolumes[project.id].remove(volume);
          ProjectActions.addItemToProject(project, volume);
        },
        afterSaveError: function(volume){
          _pendingProjectVolumes[project.id].remove(volume);
        }
      })
    };

    //
    // Polling functions
    //

    var _volumesBuilding = [];
    var pollUntilBuildIsFinished = function(volume){
      _volumesBuilding.push(volume);
      fetchAndRemoveIfFinished(volume);
    };

    var fetchAndRemoveIfFinished = function(volume){
      setTimeout(function(){
        volume.fetch().done(function(){
          var index = _volumesBuilding.indexOf(volume);
          if(validStates.indexOf(volume.get("status")) >= 0){
            _volumesBuilding.slice(index, 1);
          }else{
            fetchAndRemoveIfFinished(volume);
          }
          VolumeStore.emitChange();
        });
      }, pollingFrequency);
    };

    // The pollNow functions poll immediately and then cycle
    // as opposed to waiting for the delay and THEN polling
    var pollNowUntilBuildIsFinished = function(volume){
      if(_volumesBuilding.indexOf(volume) < 0) {
        _volumesBuilding.push(volume);
        fetchNowAndRemoveIfFinished(volume);
      }
    };

    var fetchNowAndRemoveIfFinished = function(volume){
      volume.fetch().done(function(){
        var index = _volumesBuilding.indexOf(volume);
        if(volume.get('state').isInFinalState()){
          _volumesBuilding.slice(index, 1);
        }else{
          fetchAndRemoveIfFinished(volume);
        }
        VolumeStore.emitChange();
      });
    };

    //
    // Volume Store
    //

    var VolumeStore = {

      // until instances have their own endpoint at /instances
      // we need to either fetch them using identities or the
      // information we get from projects
      getAll: function (projects) {
        if(!projects) throw new Error("Must supply projects");

        projects.each(function(project){
          this.getVolumesInProject(project);
        }.bind(this));

        return _volumes;
      },

      // getAll: function () {
      //   if(!_volumes && !_isFetching) {
      //     var identities = IdentityStore.getAll();
      //     if(identities) {
      //       fetchVolumes(identities);
      //     }
      //   }
      //   return _volumes;
      // },

      // get: function (volumeId) {
      //   if(!_volumes) {
      //     var identities = IdentityStore.getAll();
      //     if(identities) {
      //       fetchVolumes(identities);
      //     }
      //   } else {
      //     return _volumes.get(volumeId);
      //   }
      // },

      // Force the store to fetch all data and reset the contents of the store
      fetchAll: function(){
        var identities = IdentityStore.getAll();
        if(identities) {
          fetchVolumes(identities);
        }
      },

      getVolumeInProject: function(project, volumeId){
        var volumes = this.getVolumesInProject(project);
        var volume = volumes.get(volumeId);
        if(!volume){
          NotificationController.error("Volume not in project", "The volume could not be found in the project");
        }
        return volume;
      },

      getVolumesInProject: function (project) {

        var projectVolumeArray = project.get('volumes').map(function(volumeData){
          // todo: we're converting into a volume object here so we can use
          // id instead of alias for consistency. Eventually all alias attributes
          // need to be renamed id and then we can create the object only if
          // the id isn't in the existing map.
          var volume = new Volume(volumeData, {parse: true});
          var existingVolume = _volumes.get(volume.id);

          if(existingVolume){
            volume = existingVolume;
          }else{
            _volumes.push(volume);
            pollNowUntilBuildIsFinished(volume);
          }

          return volume;
        });

        // Add any pending volumes to the result set
        var pendingProjectVolumes = _pendingProjectVolumes[project.id];
        if(pendingProjectVolumes){
          projectVolumeArray = projectVolumeArray.concat(pendingProjectVolumes.models);
        }

        var projectInstances = new VolumeCollection(projectVolumeArray);
        return projectInstances;
      }

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        case VolumeConstants.VOLUME_UPDATE:
          update(action.volume);
          break;

        case VolumeConstants.VOLUME_DETACH:
          detach(action.volume);
          break;

        case VolumeConstants.VOLUME_DESTROY:
          destroy_RemoveFromProject(action.volume, action.project);
          break;

        case VolumeConstants.VOLUME_ATTACH:
          attach(action.volume, action.instance, action.mountLocation);
          break;

        case VolumeConstants.VOLUME_CREATE:
          create_AddToProject(action.volumeName, action.volumeSize, action.identity, action.project);
          break;

        default:
          return true;
      }

      VolumeStore.emitChange();

      return true;
    });

    _.extend(VolumeStore, Store);

    return VolumeStore;
  });
