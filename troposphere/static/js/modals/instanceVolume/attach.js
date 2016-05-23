import ModalHelpers from 'components/modals/ModalHelpers';
import VolumeAttachModal from 'components/modals/volume/VolumeAttachModal.react';
import stores from 'stores';
import actions from 'actions';

export default {
    attach: function(volume, project) {
        var links = stores.HelpLinkStore.getAll(),
            helpLink = links.get('volumes'),
            props = {
              volume: volume,
              project: project,
              helpLink: helpLink
            };

        ModalHelpers.renderModal(VolumeAttachModal, props,
            function (instance, mountLocation) {
                actions.InstanceVolumeActions.attach({
                  instance: instance,
                  volume: volume,
                  project: project,
                  mountLocation: mountLocation,
                  helpLink: helpLink
                });
            }
        );
    }
};
