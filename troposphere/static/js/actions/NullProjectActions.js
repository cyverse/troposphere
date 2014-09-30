define(function (require) {
  'use strict';

  //
  // Dependencies
  //

  var React                  = require('react');
  var AppDispatcher          = require('dispatchers/AppDispatcher');
  var stores                 = require('stores');
  var URL                    = require('url');
  var NotificationController = require('controllers/NotificationController');

  // Constants
  var NullProjectInstanceConstants = require('constants/NullProjectInstanceConstants');
  var NullProjectVolumeConstants   = require('constants/NullProjectVolumeConstants');
  var ProjectInstanceConstants     = require('constants/ProjectInstanceConstants');
  var ProjectVolumeConstants       = require('constants/ProjectVolumeConstants');
  var ProjectConstants             = require('constants/ProjectConstants');

  // Actions
  var ProjectActions         = require('actions/ProjectActions');

  // Models
  var Project  = require('models/Project');
  var Instance = require('models/Instance');
  var Volume   = require('models/Volume');

  // Modals
  var ModalHelpers                        = require('components/modals/ModalHelpers');
  var NullProjectMoveAttachedVolumesModal = require('components/modals/nullProject/NullProjectMoveAttachedVolumesModal.react');
  var NullProjectMigrateResourceModal     = require('components/modals/nullProject/NullProjectMigrateResourceModal.react');


  //
  // Module
  //

  return {

    dispatch: function(actionType, payload, options){
      options = options || {};
      AppDispatcher.handleRouteAction({
        actionType: actionType,
        payload: payload,
        options: options
      });
    },

    // ------------------------
    // Standard CRUD Operations
    // ------------------------

    _migrateResourceIntoProject: function(resource, project){
      ProjectActions.addResourceToProject(resource, project);

      if(resource instanceof Instance){
        this.dispatch(NullProjectInstanceConstants.REMOVE_INSTANCE_FROM_NULL_PROJECT, {
          instance: resource
        });
      }else if(resource instanceof Volume){
        this.dispatch(NullProjectVolumeConstants.REMOVE_VOLUME_FROM_NULL_PROJECT, {
          volume: resource
        });
      }
    },

    _migrateResourceIntoRealProject: function(resource, oldProject, newProject){
      ProjectActions.addResourceToProject(resource, newProject);

      if(oldProject) {
        if (resource instanceof Instance) {
          this.dispatch(ProjectInstanceConstants.REMOVE_INSTANCE_FROM_PROJECT, {
            instance: resource,
            project: oldProject
          });
        } else if (resource instanceof Volume) {
          this.dispatch(ProjectVolumeConstants.REMOVE_VOLUME_FROM_PROJECT, {
            volume: resource,
            project: oldProject
          });
        }
      }
    },

    _migrateResourcesIntoProject: function(resources, project){
      resources.map(function(resource){
        this._migrateResourceIntoProject(resource, project);
      }.bind(this));

      var redirectUrl = URL.project(project, {relative: true});
      Backbone.history.navigate(redirectUrl, {trigger: true});
    },

    // synchronize project resource state
    // 1. If resource not in a project, force user to put it into one
    // 2. If volume is attached
    // Uh oh!  Looks like you have some resources that aren't in a project.
    //
    // This can occur the first time you use
    // the new Atmosphere interface, or by switching back and forth between the old and new UI
    //
    moveAttachedVolumesIntoCorrectProject: function(){
      var projects = stores.ProjectStore.getAll();
      var instances = stores.InstanceStore.getAll(projects);
      var volumes = stores.VolumeStore.getAll(projects);

      // Move volumes into correct project
      var volumesInWrongProject = [];
      volumes.each(function(volume){
        var volumeProjectId = volume.get('projects')[0];
        var volumeProject = stores.ProjectStore.get(volumeProjectId);
        var instanceId = volume.get('attach_data').instance_id;

        if (instanceId) {
          var instance = instances.get(instanceId);
          var instanceProjectId = instance.get('projects')[0];
          if(volumeProjectId !== instanceProjectId){
            var project = stores.ProjectStore.get(instanceProjectId);
            this._migrateResourceIntoRealProject(volume, volumeProject, project);
            volumesInWrongProject.push({
              volume: volume,
              instance: instance,
              oldProject: volumeProject,
              newProject: project
            })
          }
        }
      }.bind(this));

      // Let the user know what we just did
      if(volumesInWrongProject.length > 0) {
        var modal = NullProjectMoveAttachedVolumesModal({
          movedVolumesArray: volumesInWrongProject,
          backdrop: 'static'
        });

        ModalHelpers.renderModal(modal, function(){});
      }
    },

    _volumeAllowedToBeMigratedByUser: function(volume, nullProject){
      // If has no attach data, return true
      var attached_instance_id = volume.get('attach_data').instance_id;
      if(!attached_instance_id) return true;

      // If attached to instance in null project, return true
      var instances = stores.InstanceStore.getInstancesInProject(nullProject);
      var instance = instances.get(attached_instance_id);
      if(instance) return true;

      // else return false
      return false;
    },

    migrateResourcesIntoProject: function (nullProject) {
      var that = this;
      var instances = stores.InstanceStore.getInstancesInProject(nullProject);
      var volumes = stores.VolumeStore.getVolumesInProject(nullProject);

      var resources = new Backbone.Collection();
      instances.each(function(instance){
        resources.push(instance);
      });
      volumes.each(function(volume){
        if(this._volumeAllowedToBeMigratedByUser(volume, nullProject)) {
          resources.push(volume);
        }
      }.bind(this));

      if(resources.length > 0){

        var modal = NullProjectMigrateResourceModal({
          resources: resources,
          backdrop: 'static'
        });

        ModalHelpers.renderModal(modal, function(params){
          var resourcesClone = resources.models.slice(0);
          var project;

          if(params.projectName){
            project = new Project({
              name: params.projectName,
              description: params.projectName,
              instances: [],
              volumes:[]
            });

            that.dispatch(ProjectConstants.ADD_PROJECT, {project: project});

            project.save().done(function(){
              //NotificationController.success(null, "Project " + project.get('name') + " created.");
              that.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
              that._migrateResourcesIntoProject(resourcesClone, project);
              that.moveAttachedVolumesIntoCorrectProject();
            }).fail(function(){
              var message = "Error creating Project " + project.get('name') + ".";
              NotificationController.error(null, message);
              that.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});
            });

          }else if(params.projectId && params.projects){
            project = params.projects.get(params.projectId);
            that._migrateResourcesIntoProject(resourcesClone, project);
            that.moveAttachedVolumesIntoCorrectProject();
          }else{
            throw new Error("expected either projectName OR projectId and projects parameters")
          }
        })

      }else{
        that.moveAttachedVolumesIntoCorrectProject();
      }
    }

  };

});
