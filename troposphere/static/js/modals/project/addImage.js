import actions from 'actions';
import stores from 'stores';
import ModalHelpers from 'components/modals/ModalHelpers';
import ProjectAddImageModal from 'components/modals/project/ProjectAddImageModal.react';
import NotificationController from 'controllers/NotificationController';


export default {
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
