define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
    VolumeAttachModal = require('components/modals/volume/VolumeAttachModal.react'),
    stores = require('stores'),
    actions = require('actions');

  return {

    attach: function(volume, project) {
        var links = stores.HelpLinkStore.getAll(),
            props = {
              volume: volume,
              project: project,
              helpLink: links.get('instance-launch')
            };

        ModalHelpers.renderModal(VolumeAttachModal, props,
            function (instance, mountLocation) {
                actions.InstanceVolumeActions.attach({
                  instance: instance,
                  volume: volume,
                  project: project,
                  mountLocation: mountLocation
                });
            }
        );
    }

  };

});
