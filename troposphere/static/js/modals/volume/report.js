define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
    actions = require('actions'),
    stores = require('stores'),
    VolumeReportModal = require('components/modals/volume/VolumeReportModal.react');

  return {

    report: function (params) {
      if (!params.volume) throw new Error("Missing volume");

      var volume = params.volume,
        props = {
          volume: volume,
          troubleshooting: stores.HelpLinkStore.get('faq'),
          helpLink: stores.HelpLinkStore.get('volumes')
        };

      ModalHelpers.renderModal(VolumeReportModal, props, function (reportInfo) {
        actions.VolumeActions.report({
          reportInfo: reportInfo,
          volume: volume
        });
      })
    }

  };

});
