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
    'components/modals/project/ProjectReportResourceModal.react',
    'models/Instance',
    'models/Volume',
    'models/Project',
    'url',
    './modalHelpers/ProjectModalHelpers',
    'controllers/NotificationController',
    'stores/helpers/ProjectInstance',
    'stores/helpers/ProjectVolume',
    'actions/InstanceActions',
    'actions/VolumeActions',
    'actions/ProjectInstanceActions',
    'actions/ProjectVolumeActions',
    'constants/NullProjectInstanceConstants',
    'constants/NullProjectVolumeConstants',
    'components/modals/project/ProjectCreateModal.react',
    './modalHelpers/CommonHelpers'
  ],
  function (React, AppDispatcher, ProjectConstants, ProjectInstanceConstants, ProjectVolumeConstants, InstanceConstants, VolumeConstants, CancelConfirmModal, ProjectReportResourceModal, Instance, Volume, Project, URL, ProjectModalHelpers, NotificationController, ProjectInstance, ProjectVolume, InstanceActions, VolumeActions, ProjectInstanceActions, ProjectVolumeActions, NullProjectInstanceConstants, NullProjectVolumeConstants, ProjectCreateModal, ModalHelpers) {

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
        var that = this;

        var modal = ProjectCreateModal();

        ModalHelpers.renderModal(modal, function(name, description){

          var project = new Project({
            name: name,
            description: description
          });

          that.dispatch(ProjectConstants.ADD_PROJECT, {project: project});

          project.save().done(function(){
            //NotificationController.success(null, "Project " + project.get('name') + " created.");
            that.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
          }).fail(function(){
            var message = "Error creating Project " + project.get('name') + ".";
            NotificationController.error(null, message);
            that.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});
          });
        })

      },

      updateProjectAttributes: function (project, newAttributes) {
        var that = this;

        project.set(newAttributes);
        that.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});

        project.save().done(function(){
          //NotificationController.success(null, "Project name updated.");
        }).fail(function(){
          NotificationController.error(null, "Error updating Project " + project.get('name') + ".");
          that.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
        });
      },

      destroy: function (project) {
        var that = this;
        ProjectModalHelpers.destroy({
          project: project
        },{
          onConfirm: function(){
            that.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});

            project.destroy().done(function(){
              //NotificationController.success(null, "Project " + project.get('name') + " deleted.");
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

      // --------------------
      // Informational Actions
      // --------------------

      explainProjectDeleteConditions: function(){
        ProjectModalHelpers.explainProjectDeleteConditions();
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

        ProjectModalHelpers.removeResources({
          resources: resources,
          project: project
        },{
          onConfirm: function(){
            resources.map(function(resource){
              that.removeResourceFromProject(resource, project, {silent: true});
              if(resource instanceof Instance){
                  that.dispatch(NullProjectInstanceConstants.ADD_INSTANCE_TO_NULL_PROJECT, {
                    instance: resource
                  });
                }else if(resource instanceof Volume){
                  that.dispatch(NullProjectVolumeConstants.ADD_VOLUME_TO_NULL_PROJECT, {
                    volume: resource
                  });
                }
            });
            that.dispatch(ProjectConstants.EMIT_CHANGE);
          }
        });
      },

      // ------------------------
      // Delete Project Resources
      // ------------------------

      deleteResources: function(resources, project){
        var that = this;

        ProjectModalHelpers.deleteResources({
          resources: resources
        },{
          onConfirm: function(){
            // We need to clone the array because we're going to be destroying
            // the model and that will cause it to be removed from the collection
            var clonedResources = resources.models.slice(0);

            clonedResources.map(function(resource){
                that.deleteResource(resource, project, {silent: true});
            });

            that.dispatch(ProjectConstants.EMIT_CHANGE);
          }
        });
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
