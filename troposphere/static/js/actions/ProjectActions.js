define(
  [
    'react',
    'dispatchers/AppDispatcher',

    // Constants
    'constants/ProjectConstants',
    'constants/NullProjectInstanceConstants',
    'constants/NullProjectVolumeConstants',

    // Models
    'models/Instance',
    'models/Volume',
    'models/Project',

    'url',
    'controllers/NotificationController',

    // Actions
    'actions/InstanceActions',
    'actions/VolumeActions',
    'actions/ProjectInstanceActions',
    'actions/ProjectVolumeActions',

    // Modals
    'components/modals/ModalHelpers',
    'components/modals/project/ProjectCreateModal.react',
    'components/modals/project/ProjectDeleteModal.react',
    'components/modals/project/ProjectDeleteConditionsModal.react',
    'components/modals/project/ProjectMoveResourceModal.react',
    'components/modals/project/ProjectDeleteResourceModal.react',
    'components/modals/project/ProjectRemoveResourceModal.react',
    'components/modals/project/ProjectReportResourceModal.react',

    './Utils'
  ],
  function (React, AppDispatcher, ProjectConstants, NullProjectInstanceConstants, NullProjectVolumeConstants, Instance, Volume, Project, URL, NotificationController, InstanceActions, VolumeActions, ProjectInstanceActions, ProjectVolumeActions, ModalHelpers, ProjectCreateModal, ProjectDeleteModal, ProjectDeleteConditionsModal, ProjectMoveResourceModal, ProjectDeleteResourceModal, ProjectRemoveResourceModal, ProjectReportResourceModal, Utils) {

    var _isParanoid = false;

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

          var redirectUrl = URL.projects(null, {relative: true});
          Backbone.history.navigate(redirectUrl, {trigger: true});
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
            that.addResourceToProject(resource, newProject, {silent: true});
            that.removeResourceFromProject(resource, currentProject, {silent: true});
          });
          Utils.dispatch(ProjectConstants.EMIT_CHANGE);
        });
      },

      // ----------------------------
      // Add/Remove Project Resources
      // ----------------------------

      addResourceToProject: function(resource, project, options){
        if(resource instanceof Instance){
          ProjectInstanceActions.addInstanceToProject(resource, project, options);
        }else if(resource instanceof Volume){
          ProjectVolumeActions.addVolumeToProject(resource, project, options);
        }else{
          throw new Error("Unknown resource type");
        }
      },

      removeResourceFromProject: function(resource, project, options){
        if(resource instanceof Instance){
          ProjectInstanceActions.removeInstanceFromProject(resource, project, options);
        }else if(resource instanceof Volume){
          ProjectVolumeActions.removeVolumeFromProject(resource, project, options);
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
            that.removeResourceFromProject(resource, project, {silent: true});
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
              that.deleteResource(resource, project, {silent: true});
          });

          Utils.dispatch(ProjectConstants.EMIT_CHANGE);
        })
      },

      deleteResource: function(resource, project, options){
        // todo: remove instance from project after deletion
        if(resource instanceof Instance){
          InstanceActions.terminate_noModal({
            instance: resource,
            project: project
          }, options);
        }else if(resource instanceof Volume){
          VolumeActions.destroy_noModal({
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
