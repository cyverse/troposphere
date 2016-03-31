import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import ProjectAddImageModal from 'components/modals/project/ProjectAddImageModal.react';

export default {

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
