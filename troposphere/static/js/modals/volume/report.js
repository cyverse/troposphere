define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
      actions = require('actions'),
      VolumeReportModal = require('components/modals/volume/VolumeReportModal.react');

  return {

    report: function(params){
      if(!params.volume) throw new Error("Missing volume");

      var volume = params.volume,
          modal = VolumeReportModal({
            volume: volume
          });

      ModalHelpers.renderModal(modal, function (reportInfo) {
        actions.VolumeActions.report({
          reportInfo: reportInfo,
          volume: volume
        });
      })
    }

  };

});
