import ModalHelpers from 'components/modals/ModalHelpers';
import InstanceResumeModal from 'components/modals/instance/InstanceResumeModal.react';
import actions from 'actions';

export default {

    resume: function (instance) {
      ModalHelpers.renderModal(InstanceResumeModal, null, function () {
        actions.InstanceActions.resume({
          instance: instance
        })
      });
    }

};
