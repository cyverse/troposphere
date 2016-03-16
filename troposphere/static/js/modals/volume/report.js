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
        links = stores.HelpLinkStore.getAll();
        props = {
          volume: volume,
          troubleshooting: links.get('faq'),
          helpLink: links.get('volumes')
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
