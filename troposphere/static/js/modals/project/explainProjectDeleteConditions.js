import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import ProjectDeleteConditionsModal from 'components/modals/project/ProjectDeleteConditionsModal.react';

export default {
    explainProjectDeleteConditions: function () {
      ModalHelpers.renderModal(ProjectDeleteConditionsModal, null, function () {
      });
    }
}
