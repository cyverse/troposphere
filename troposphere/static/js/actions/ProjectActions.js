define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/ProjectConstants',
    'constants/ProjectInstanceConstants',
    'constants/ProjectVolumeConstants',
    'components/modals/CancelConfirmModal.react',
    //'components/modals/ProjectAddResourceModal.react',
    'models/Instance',
    'models/Volume'
  ],
  function (React, AppDispatcher, ProjectConstants, ProjectInstanceConstants, ProjectVolumeConstants, CancelConfirmModal, Instance, Volume) {

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

//      addResourceToProject: function(project){
//
//        var onCreateVolume = function (volumeParams) {
//          AppDispatcher.handleRouteAction({
//            actionType: ProjectConstants.PROJECT_CREATE_VOLUME_AND_ADD_TO_PROJECT,
//            project: project,
//            volumeParams: volumeParams
//          });
//        };
//
//        var onCancel = function(){
//          // Important! We need to un-mount the component so it un-registers from Stores and
//          // also so that we can relaunch it again later.
//          React.unmountComponentAtNode(document.getElementById('modal'));
//        };
//
//        var modal = ProjectAddResourceModal({
//          header: "Add Resource to Project",
//          onCancel: onCancel,
//          handleHidden: onCancel,
//          onCreateVolume: onCreateVolume
//        });
//
//        React.renderComponent(modal, document.getElementById('modal'));
//      }

    };

  });
