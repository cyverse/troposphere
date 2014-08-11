define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/ProjectConstants',
    'constants/ProjectInstanceConstants',
    'constants/ProjectVolumeConstants',
    'constants/InstanceConstants',
    'constants/VolumeConstants',
    'components/modals/CancelConfirmModal.react',
    'components/modals/ProjectMoveResourceModal.react',
    'components/modals/ProjectDeleteResourceModal.react',
    'components/modals/ProjectReportResourceModal.react',
    'models/Instance',
    'models/Volume',
    'url',
    './modalHelpers/ProjectModalHelpers',
    'controllers/NotificationController',
    'stores/helpers/ProjectInstance',
    'stores/helpers/ProjectVolume',
    'actions/InstanceActions',
    'actions/VolumeActions'
  ],
  function (React, AppDispatcher, ProjectConstants, ProjectInstanceConstants, ProjectVolumeConstants, InstanceConstants, VolumeConstants, CancelConfirmModal, ProjectMoveResourceModal, ProjectDeleteResourceModal, ProjectReportResourceModal, Instance, Volume, URL, ProjectModalHelpers, NotificationController, ProjectInstance, ProjectVolume, InstanceActions, VolumeActions) {

    var _isParanoid = false;

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

      create: function (project) {
        AppDispatcher.handleRouteAction({
          actionType: ProjectConstants.PROJECT_CREATE,
          model: project
        });
      },

      updateProjectAttributes: function (project, newAttributes) {
        project.set(newAttributes);
        AppDispatcher.handleRouteAction({
          actionType: ProjectConstants.PROJECT_UPDATE,
          model: project
        });
      },

      destroy: function (project) {
        var that = this;
        ProjectModalHelpers.destroy(project, {
          onConfirm: function(){
            that.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});

            project.destroy().done(function(){
              // handle success
            }).fail(function(){
              var failureMessage = "Error deleting Project " + project.get('name') + ".";
              NotificationController.error(failureMessage);
              that.dispatch(ProjectConstants.ADD_PROJECT, {project: project});
            });

            var redirectUrl = URL.projects(null, {relative: true});
            Backbone.history.navigate(redirectUrl, {trigger: true});
          }
        });
      },

      // ----------------------
      // Move Project Resources
      // ----------------------

      moveResources: function (resources, currentProject) {
        var that = this;

        ProjectModalHelpers.moveResources({
          resources: resources,
          currentProject: currentProject
        },{
          onConfirm: function(newProject){
            resources.map(function(resource){
              that.addResourceToProject(resource, newProject, {silent: true});
              that.removeResourceFromProject(resource, currentProject, {silent: true});
            });
            that.dispatch(ProjectConstants.EMIT_CHANGE);
          }
        });
      },

      // ----------------------------
      // Add/Remove Project Resources
      // ----------------------------

      addResourceToProject: function(resource, project, options){
        if(resource instanceof Instance){
          this._addInstanceToProject(resource, project, options);
        }else if(resource instanceof Volume){
          this._addVolumeToProject(resource, project, options);
        }else{
          throw new Error("Unknown resource type");
        }
      },

      removeResourceFromProject: function(resource, project, options){
        if(resource instanceof Instance){
          this._removeInstanceFromProject(resource, project, options);
        }else if(resource instanceof Volume){
          this._removeVolumeFromProject(resource, project, options);
        }else{
          throw new Error("Unknown resource type");
        }
      },

      _addInstanceToProject: function(instance, project, options){
        var that = this;

        var projectInstance = new ProjectInstance({
          instance: instance,
          project: project
        });

        this.dispatch(ProjectInstanceConstants.ADD_INSTANCE_TO_PROJECT, {
          instance: instance,
          project: project
        }, options);

        projectInstance.save().done(function(){
          // re-fetch the project to make sure the change was also made on the server
          if(_isParanoid) {
            project.fetch().then(function () {
              that.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
            });
          }
        }).fail(function(){
          that.dispatch(ProjectInstanceConstants.REMOVE_INSTANCE_FROM_PROJECT, {
            instance: instance,
            project: project
          });
        });
      },

      _removeInstanceFromProject: function(instance, project, options){
        var that = this;

        var projectInstance = new ProjectInstance({
          instance: instance,
          project: project
        });

        this.dispatch(ProjectInstanceConstants.REMOVE_INSTANCE_FROM_PROJECT, {
          instance: instance,
          project: project
        }, options);

        projectInstance.destroy().done(function(){
          // re-fetch the project to make sure the change was also made on the server
          if(_isParanoid) {
            project.fetch().then(function () {
              that.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
            });
          }
        }).fail(function(){
          that.dispatch(ProjectInstanceConstants.ADD_INSTANCE_TO_PROJECT, {
            instance: instance,
            project: project
          });
        });
      },

      _addVolumeToProject: function(volume, project, options){
        var that = this;

        var projectVolume = new ProjectVolume({
          volume: volume,
          project: project
        });

        this.dispatch(ProjectVolumeConstants.ADD_VOLUME_TO_PROJECT, {
          volume: volume,
          project: project
        }, options);

        projectVolume.save().done(function(){
          // re-fetch the project to make sure the change was also made on the server
          if(_isParanoid) {
            project.fetch().then(function () {
              that.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
            });
          }
        }).fail(function(){
          that.dispatch(ProjectVolumeConstants.REMOVE_VOLUME_FROM_PROJECT, {
            volume: volume,
            project: project
          });
        });
      },

      _removeVolumeFromProject: function(volume, project, options){
        var that = this;

        var projectVolume = new ProjectVolume({
          volume: volume,
          project: project
        });

        this.dispatch(ProjectVolumeConstants.REMOVE_VOLUME_FROM_PROJECT, {
          volume: volume,
          project: project
        }, options);

        projectVolume.destroy().done(function(){
          // re-fetch the project to make sure the change was also made on the server
          if(_isParanoid) {
            project.fetch().then(function () {
              that.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
            });
          }
        }).fail(function(){
          that.dispatch(ProjectVolumeConstants.ADD_VOLUME_TO_PROJECT, {
            volume: volume,
            project: project
          });
        });
      },

      // ------------------------
      // Delete Project Resources
      // ------------------------

      deleteResources: function(resources, project){

        var onConfirm = function () {
          resources.map(function(resource){
            this.deleteResource(resource, project);
          }.bind(this));
        }.bind(this);

        var onCancel = function(){
          // Important! We need to un-mount the component so it un-registers from Stores and
          // also so that we can relaunch it again later.
          React.unmountComponentAtNode(document.getElementById('modal'));
        };

        var modal = ProjectDeleteResourceModal({
          header: "Delete Resources",
          confirmButtonMessage: "Delete resources",
          onConfirm: onConfirm,
          onCancel: onCancel,
          handleHidden: onCancel,
          resources: resources
        });

        React.renderComponent(modal, document.getElementById('modal'));
      },

      deleteResource: function(resource, project){
        // todo: remove instance from project after deletion
        if(resource instanceof Instance){
          InstanceActions.terminate({
            instance: resource,
            project: project
          });
        }else if(resource instanceof Volume){
          VolumeActions.terminate({
            instance: resource,
            project: project
          });
        }else{
          throw new Error("Unknown resource type");
        }
      },

      // ------------------------
      // Report Project Resources
      // ------------------------

      reportResources: function(project, resources){

        var onConfirm = function () {
          // todo: report the resources
        }.bind(this);

        var onCancel = function(){
          // Important! We need to un-mount the component so it un-registers from Stores and
          // also so that we can relaunch it again later.
          React.unmountComponentAtNode(document.getElementById('modal'));
        };

        var modal = ProjectReportResourceModal({
          header: "Report Resources",
          confirmButtonMessage: "Send",
          onConfirm: onConfirm,
          onCancel: onCancel,
          handleHidden: onCancel,
          project: project,
          resources: resources
        });

        React.renderComponent(modal, document.getElementById('modal'));
      }

    };

  });
