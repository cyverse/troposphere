define(function (require) {

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      ProjectMoveResourceModal = require('components/modals/project/ProjectMoveResourceModal.react');

  return {

    moveResources: function (resources, currentProject) {

      var props = {
        currentProject: currentProject,
        resources: resources
      };

      ModalHelpers.renderModal(ProjectMoveResourceModal, props, function(newProject){
        actions.ProjectActions.moveResources({
          currentProject: currentProject,
          resources: resources,
          newProject: newProject
        });

      });
    }

  };

});
