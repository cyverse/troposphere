define(function (require) {

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      ProjectMoveResourceModal = require('components/modals/project/ProjectMoveResourceModal.react');

  return {

    moveResources: function (resources, currentProject) {

      var modal = ProjectMoveResourceModal({
        currentProject: currentProject,
        resources: resources
      });

      ModalHelpers.renderModal(modal, function(newProject){
        actions.ProjectActions.moveResources({
          currentProject: currentProject,
          resources: resources,
          newProject: newProject
        });
      //  resources.map(function(resource){
      //    that.addResourceToProject(resource, newProject, {silent: false});
      //    that.removeResourceFromProject(resource, currentProject, {silent: false});
      //  });
      //  Utils.dispatch(ProjectConstants.EMIT_CHANGE);
      });
    }

  };

});
