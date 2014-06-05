define(
  [
    'dispatchers/app_dispatcher',
    'constants/ProjectConstants',
    'constants/ProjectInstanceConstants',
    'constants/ProjectVolumeConstants',
    'components/modals/CancelConfirmModal.react',
    'react',
    'models/instance',
    'models/volume'
  ],
  function (AppDispatcher, ProjectConstants, ProjectInstanceConstants, ProjectVolumeConstants, CancelConfirmModal, React, Instance, Volume) {

    function getItemType(model) {
      var objectType;
      if (model instanceof Instance) {
        objectType = 'instance';
      } else if (model instanceof Volume) {
        objectType = 'volume';
      } else {
        throw "Unknown model type";
      }
      return objectType;
    }

    return {
      create: function (project) {
        AppDispatcher.handleRouteAction({
          actionType: ProjectConstants.PROJECT_CREATE,
          model: project
        });
      },

      destroy: function (project) {

        var onConfirm = function () {
          AppDispatcher.handleRouteAction({
            actionType: ProjectConstants.PROJECT_DESTROY,
            model: project
          });
        };

        var body = 'Are you sure you would like to delete project "' + project.get('name') + '"?';

        var modal = CancelConfirmModal({
          header: "Delete Project",
          confirmButtonMessage: "Delete project",
          onConfirm: onConfirm,
          body: body
        });

        React.renderComponent(modal, document.getElementById('modal'));
      },

      moveProjectItemTo: function(sourceProject, projectItem, targetProject){
        this.removeItemFromProject(sourceProject, projectItem);
        this.addItemToProject(targetProject, projectItem);
      },

      addItemToProject: function(project, projectItem){
        var itemType = getItemType(projectItem);
        if(itemType === "instance"){
          AppDispatcher.handleRouteAction({
            actionType: ProjectInstanceConstants.ADD_INSTANCE_TO_PROJECT,
            project: project,
            instance: projectItem
          });
        }else if(itemType === "volume"){
          AppDispatcher.handleRouteAction({
            actionType: ProjectVolumeConstants.ADD_VOLUME_TO_PROJECT,
            project: project,
            volume: projectItem
          });
        }
      },

      removeItemFromProject: function(project, projectItem){
        var itemType = getItemType(projectItem);
        if(itemType === "instance"){
          AppDispatcher.handleRouteAction({
            actionType: ProjectInstanceConstants.REMOVE_INSTANCE_FROM_PROJECT,
            project: project,
            instance: projectItem
          });
        }else if(itemType === "volume"){
          AppDispatcher.handleRouteAction({
            actionType: ProjectVolumeConstants.REMOVE_VOLUME_FROM_PROJECT,
            project: project,
            volume: projectItem
          });
        }
      }

    };

  });
