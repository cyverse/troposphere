define(function (require) {

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      ProjectDeleteModal = require('components/modals/project/ProjectDeleteModal.react');

  return {

    destroy: function (project) {

      var modal = ProjectDeleteModal({
        project: project
      });

      ModalHelpers.renderModal(modal, function(){
        actions.ProjectActions.destroy({
          project: project
        });

      })
    }

  };

});
