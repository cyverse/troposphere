define(function (require) {

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      ProjectDeleteModal = require('components/modals/project/ProjectDeleteModal.react');

  return {

    destroy: function (project) {

      var props = {
        project: project
      };

      ModalHelpers.renderModal(ProjectDeleteModal, props, function(){
        actions.ProjectActions.destroy({
          project: project
        });

      })
    }

  };

});
