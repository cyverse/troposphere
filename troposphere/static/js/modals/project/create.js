import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import ProjectCreateModal from 'components/modals/project/ProjectCreateModal.react';

export default {
    create: function () {
      ModalHelpers.renderModal(ProjectCreateModal, null, function (name, description) {
        actions.ProjectActions.create({
          name: name,
          description: description
        });
      })

    }
};
