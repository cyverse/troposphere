import actions from "actions";
import stores from "stores";
import ModalHelpers from "components/modals/ModalHelpers";

import VolumeReportModal from "components/modals/volume/VolumeReportModal";


export default {
    report: function(params) {
        if (!params.volume)
            throw new Error("Missing volume");

        var volume = params.volume,
            props = {
                volume: volume,
                troubleshooting: stores.HelpLinkStore.get("faq"),
                helpLink: stores.HelpLinkStore.get("volumes")
            };

        ModalHelpers.renderModal(VolumeReportModal, props, function(reportInfo) {
            actions.VolumeActions.report({
                reportInfo: reportInfo,
                volume: volume
            });
        })
    }
};
