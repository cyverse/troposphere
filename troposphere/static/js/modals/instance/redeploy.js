import ModalHelpers from 'components/modals/ModalHelpers';
import InstanceRedeployModal from 'components/modals/instance/InstanceRedeployModal.react';
import actions from 'actions';

export default {

    redeploy: function (instance) {
      ModalHelpers.renderModal(InstanceRedeployModal, null, function () {
        actions.InstanceActions.redeploy({
          instance: instance
        });
      });
    }

};
