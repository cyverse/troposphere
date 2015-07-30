define(function (require) {

  var actions = require('actions'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    ProjectRemoveResourceModal = require('components/modals/project/ProjectRemoveResourceModal.react');

  return {

    removeResources: function (resources, project) {
      var props = {
        project: project,
        resources: resources
      };

      ModalHelpers.renderModal(ProjectRemoveResourceModal, props, function () {
        actions.ProjectActions.removeResources({
          project: project,
          resources: resources
        });
      })
    }

  };

});
