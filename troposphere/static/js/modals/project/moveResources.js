import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import ProjectMoveResourceModal from 'components/modals/project/ProjectMoveResourceModal.react';


export default {
    moveResources: function (resources, currentProject, callback) {

      var props = {
        currentProject: currentProject,
        resources: resources
      };

      ModalHelpers.renderModal(ProjectMoveResourceModal, props, function (newProject) {
        actions.ProjectActions.moveResources({
          currentProject: currentProject,
          resources: resources,
          newProject: newProject
        });
        callback();
      });
    }
};
