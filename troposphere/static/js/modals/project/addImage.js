define(function (require) {

  var actions = require('actions'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    ProjectAddImageModal = require('components/modals/project/ProjectAddImageModal.react');

  return {

    addImage: function (image) {

      var props = {
        image: image,
      };

      ModalHelpers.renderModal(ProjectAddImageModal, props, function (project, image) {
        // Call the ProjectAction directly after confirmation.
        actions.ProjectActions.addResourceToProject(image, project, {silent: false});

      });
    }

  };

});
