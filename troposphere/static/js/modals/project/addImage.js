define(function (require) {

  var actions = require('actions'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    NotificationController = require('controllers/NotificationController'),
    ProjectAddImageModal = require('components/modals/project/ProjectAddImageModal.react');

  return {

    addImage: function (image) {

      var props = {
        image: image,
      };

      ModalHelpers.renderModal(ProjectAddImageModal, props, function (project, image) {
        // Call the ProjectAction directly after confirmation.
        actions.ProjectActions.addResourceToProject(image, project, {silent: false});
        // Delete the cached query - Its results are invalid now.
        delete stores.ProjectImageStore.queryModels["?application__id="+image.id];
        // Notify the user of the successful addition.
        NotificationController.success(null, "Image " + image.get('name') + " added to Project " + project.get('name') + ".");

      });
    }

  };

});
