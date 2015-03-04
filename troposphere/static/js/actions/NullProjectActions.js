define(function (require) {
  'use strict';

  //
  // Dependencies
  //

  var AppDispatcher          = require('dispatchers/AppDispatcher'),
      stores                 = require('stores'),
      NotificationController = require('controllers/NotificationController'),
      Router                 = require('../Router'),
      Utils                  = require('./Utils'),
      actions                = require('actions');

  // Constants
  var NullProjectInstanceConstants = require('constants/NullProjectInstanceConstants'),
      NullProjectVolumeConstants   = require('constants/NullProjectVolumeConstants'),
      ProjectInstanceConstants     = require('constants/ProjectInstanceConstants'),
      ProjectVolumeConstants       = require('constants/ProjectVolumeConstants'),
      ProjectConstants             = require('constants/ProjectConstants');

  // Models
  var Project  = require('models/Project'),
      Instance = require('models/Instance'),
      Volume   = require('models/Volume');

  // Modals
  var ModalHelpers                        = require('components/modals/ModalHelpers'),
      NullProjectMoveAttachedVolumesModal = require('components/modals/nullProject/NullProjectMoveAttachedVolumesModal.react'),
      NullProjectMigrateResourceModal     = require('components/modals/nullProject/NullProjectMigrateResourceModal.react');

  //
  // Module
  //

  return {

    // ------------------------
    // Standard CRUD Operations
    // ------------------------

    _migrateResourceIntoProject: function(resource, project){
      actions.ProjectActions.addResourceToProject(resource, project);

      if(resource instanceof Instance){
        Utils.dispatch(NullProjectInstanceConstants.REMOVE_INSTANCE_FROM_NULL_PROJECT, {
          instance: resource
        });
      }else if(resource instanceof Volume){
        Utils.dispatch(NullProjectVolumeConstants.REMOVE_VOLUME_FROM_NULL_PROJECT, {
          volume: resource
        });
      }
    },

    _migrateResourceIntoRealProject: function(resource, oldProject, newProject){
      actions.ProjectActions.addResourceToProject(resource, newProject);

      if(oldProject) {
        if (resource instanceof Instance) {
          Utils.dispatch(ProjectInstanceConstants.REMOVE_PROJECT_INSTANCE, {
            instance: resource,
            project: oldProject
          });
        } else if (resource instanceof Volume) {
          Utils.dispatch(ProjectVolumeConstants.REMOVE_PROJECT_VOLUME, {
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

      Router.getInstance().transitionTo("project-resources", {projectId: project.id});
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
          if(!instance){
            console.warn("Instance with id: " + instanceId + " was not found.");
            return;
          }
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

    // todo: remove this function or discover why it exists
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
      var instances = nullProject.get('instances'),
          volumes = nullProject.get('volumes'),
          resources = new Backbone.Collection(),
          that = this;

      instances.each(function(instance){
        resources.push(instance);
      });

      //volumes.each(function(volume){
      //  if(this._volumeAllowedToBeMigratedByUser(volume, nullProject)) {
      //    resources.push(volume);
      //  }
      //}.bind(this));

      volumes.each(function(volume){
        resources.push(volume);
      });

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

            Utils.dispatch(ProjectConstants.ADD_PROJECT, {project: project});

            project.save().done(function(){
              //NotificationController.success(null, "Project " + project.get('name') + " created.");
              Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
              that._migrateResourcesIntoProject(resourcesClone, project);
              that.moveAttachedVolumesIntoCorrectProject();
            }).fail(function(){
              var message = "Error creating Project " + project.get('name') + ".";
              NotificationController.error(null, message);
              Utils.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});
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
