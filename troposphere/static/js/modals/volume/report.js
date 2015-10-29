import ModalHelpers from 'components/modals/ModalHelpers';
import actions from 'actions';
import VolumeReportModal from 'components/modals/volume/VolumeReportModal.react';

export default {
    report: function (params) {
      if (!params.volume) throw new Error("Missing volume");

      var volume = params.volume,
        props = {
          volume: volume
        };

      ModalHelpers.renderModal(VolumeReportModal, props, function (reportInfo) {
        actions.VolumeActions.report({
          reportInfo: reportInfo,
          volume: volume
        });
      })
    }
};
