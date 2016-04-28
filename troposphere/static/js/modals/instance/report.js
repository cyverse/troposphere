define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
    InstanceReportModal = require('components/modals/instance/InstanceReportModal.react'),
    stores = require('stores'),
    actions = require('actions');

  return {

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

});
