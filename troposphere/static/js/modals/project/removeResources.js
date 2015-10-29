import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import ProjectRemoveResourceModal from 'components/modals/project/ProjectRemoveResourceModal.react';

export default {
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
