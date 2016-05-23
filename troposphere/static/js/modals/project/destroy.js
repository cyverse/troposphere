import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import ProjectDeleteModal from 'components/modals/project/ProjectDeleteModal.react';

export default {
    destroy: function (project) {

      var props = {
        project: project
      };

      ModalHelpers.renderModal(ProjectDeleteModal, props, function () {
        actions.ProjectActions.destroy({
          project: project
        });

      })
    }
};
