import ModalHelpers from 'components/modals/ModalHelpers';
import InstanceReportModal from 'components/modals/instance/InstanceReportModal.react';
import stores from 'stores';
import actions from 'actions';


export default {
    report: function (params) {
      if (!params.instance) throw new Error("Missing instance");

      var instance = params.instance,
        props = {
          instance: instance,
          troubleshooting: stores.HelpLinkStore.get('faq'),
          usingInstances: stores.HelpLinkStore.get('instances')
        };


      ModalHelpers.renderModal(InstanceReportModal, props, function (reportInfo) {
        actions.InstanceActions.report({
          instance: instance,
          reportInfo: reportInfo
        })
      })
    }
};
