define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      Utils = require('./Utils'),
      actions = require('actions'),
      NotificationController = require('controllers/NotificationController'),
      Router = require('../Router'),

      // Constants
      ProjectConstants = require('constants/ProjectConstants'),
      NullProjectInstanceConstants = require('constants/NullProjectInstanceConstants'),
      NullProjectVolumeConstants = require('constants/NullProjectVolumeConstants'),

      // Models
      Instance = require('models/Instance'),
      Volume = require('models/Volume'),
      Project = require('models/Project'),

      // Modals
      ModalHelpers = require('components/modals/ModalHelpers'),
      ProjectCreateModal = require('components/modals/project/ProjectCreateModal.react'),
      ProjectDeleteModal = require('components/modals/project/ProjectDeleteModal.react'),
      ProjectDeleteConditionsModal = require('components/modals/project/ProjectDeleteConditionsModal.react'),
      ProjectMoveResourceModal = require('components/modals/project/ProjectMoveResourceModal.react'),
      ProjectDeleteResourceModal = require('components/modals/project/ProjectDeleteResourceModal.react'),
      ProjectRemoveResourceModal = require('components/modals/project/ProjectRemoveResourceModal.react'),
      ProjectReportResourceModal = require('components/modals/project/ProjectReportResourceModal.react');

  return {

    // ------------------------
    // Standard CRUD Operations
    // ------------------------

    create: function (project) {
      var that = this;

      var modal = ProjectCreateModal();

      ModalHelpers.renderModal(modal, function(name, description){

        var project = new Project({
          name: name,
          description: description
        });

        Utils.dispatch(ProjectConstants.ADD_PROJECT, {project: project});

        project.save().done(function(){
          //NotificationController.success(null, "Project " + project.get('name') + " created.");
          Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
        }).fail(function(){
          var message = "Error creating Project " + project.get('name') + ".";
          NotificationController.error(null, message);
          Utils.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});
        });
      })

    },

    updateProjectAttributes: function (project, newAttributes) {
      var that = this;

      project.set(newAttributes);
      Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});

      project.save().done(function(){
        //NotificationController.success(null, "Project name updated.");
      }).fail(function(){
        NotificationController.error(null, "Error updating Project " + project.get('name') + ".");
        Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
      });
    },

    destroy: function (project) {
      var that = this;

      var modal = ProjectDeleteModal({
        project: project
      });

      ModalHelpers.renderModal(modal, function(){
        Utils.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});

        project.destroy().done(function(){
          //NotificationController.success(null, "Project " + project.get('name') + " deleted.");
        }).fail(function(){
          var failureMessage = "Error deleting Project " + project.get('name') + ".";
          NotificationController.error(failureMessage);
          Utils.dispatch(ProjectConstants.ADD_PROJECT, {project: project});
        });

        Router.getInstance().transitionTo("projects");
      })
    },

    // --------------------
    // Informational Actions
    // --------------------

    explainProjectDeleteConditions: function(){
      var modal = ProjectDeleteConditionsModal();

      ModalHelpers.renderModal(modal, function(){});
    },

    // ----------------------
    // Move Project Resources
    // ----------------------

    moveResources: function (resources, currentProject) {
      var that = this;

      var modal = ProjectMoveResourceModal({
        currentProject: currentProject,
        resources: resources
      });

      ModalHelpers.renderModal(modal, function(newProject){
        resources.map(function(resource){
          that.addResourceToProject(resource, newProject, {silent: false});
          that.removeResourceFromProject(resource, currentProject, {silent: false});
        });
        Utils.dispatch(ProjectConstants.EMIT_CHANGE);
      });
    },

    // ----------------------------
    // Add/Remove Project Resources
    // ----------------------------

    addResourceToProject: function(resource, project, options){
      // todo: settings projects here is a bad hack - it's because there are a
      // few places in the code that access instance/volume.get('projects')[0]
      // Instead we need to change those places to access a resources project
      // either through stores.ProjectInstanceStore or the route URL (getParams().projectId);
      resource.set('projects', [project.id]);

      if(resource instanceof Instance){
        actions.ProjectInstanceActions.addInstanceToProject({
          project: project,
          instance: resource
        }, options);
      }else if(resource instanceof Volume){
        actions.ProjectVolumeActions.addVolumeToProject({
          project: project,
          volume: resource
        }, options);
      }else{
        throw new Error("Unknown resource type");
      }
    },

    removeResourceFromProject: function(resource, project, options){
      if(resource instanceof Instance){
        actions.ProjectInstanceActions.removeInstanceFromProject({
          project: project,
          instance: resource
        }, options);
      }else if(resource instanceof Volume){
        actions.ProjectVolumeActions.removeVolumeFromProject({
          project: project,
          volume: resource
        }, options);
      }else{
        throw new Error("Unknown resource type");
      }
    },

    removeResources: function(resources, project){
      var that = this;

      var modal = ProjectRemoveResourceModal({
        project: project,
        resources: resources
      });

      ModalHelpers.renderModal(modal, function(){
        resources.map(function(resource){
          that.removeResourceFromProject(resource, project);
          if(resource instanceof Instance){
              Utils.dispatch(NullProjectInstanceConstants.ADD_INSTANCE_TO_NULL_PROJECT, {
                instance: resource
              });
            }else if(resource instanceof Volume){
              Utils.dispatch(NullProjectVolumeConstants.ADD_VOLUME_TO_NULL_PROJECT, {
                volume: resource
              });
            }
        });
        Utils.dispatch(ProjectConstants.EMIT_CHANGE);
      })
    },

    // ------------------------
    // Delete Project Resources
    // ------------------------

    deleteResources: function(resources, project){
      var that = this;

      var modal = ProjectDeleteResourceModal({
        resources: resources
      });

      ModalHelpers.renderModal(modal, function(){
        // We need to clone the array because we're going to be destroying
        // the model and that will cause it to be removed from the collection
        var clonedResources = resources.models.slice(0);

        clonedResources.map(function(resource){
            that.deleteResource(resource, project, {silent: false});
        });

        Utils.dispatch(ProjectConstants.EMIT_CHANGE);
      })
    },

    deleteResource: function(resource, project, options){
      // todo: remove instance from project after deletion
      if(resource instanceof Instance){
        actions.InstanceActions.terminate_noModal({
          instance: resource,
          project: project
        }, options);
      }else if(resource instanceof Volume){
        actions.VolumeActions.destroy_noModal({
          volume: resource,
          project: project
        }, options);
      }else{
        throw new Error("Unknown resource type");
      }
    },

    // ------------------------
    // Report Project Resources
    // ------------------------

    reportResources: function(project, resources){
      var modal = ProjectReportResourceModal({
        project: project,
        resources: resources
      });

      ModalHelpers.renderModal(modal, function(){
        // todo: report the resources
        alert("Report resources not yet implemented")
      });
    }

  };

});
