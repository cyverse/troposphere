define(function (require) {

  var VolumeConstants = require('constants/VolumeConstants'),
      ProjectVolumeConstants = require('constants/ProjectVolumeConstants'),
      NotificationController = require('controllers/NotificationController'),
      Volume = require('models/Volume'),
      actions = require('actions'),
      globals = require('globals'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      VolumeCreateModal = require('components/modals/volume/VolumeCreateModal.react'),
      Utils = require('../Utils');

  return {

    createAndAddToProject: function(payload){
      if(!payload.project) throw new Error("Missing project");

      var project = payload.project,
          modal = VolumeCreateModal();

      ModalHelpers.renderModal(modal, function (volumeName, volumeSize, identity) {
        var identityUUID = identity.get('uuid'),
            providerUUID = identity.get('provider').uuid,
            url = (
              globals.API_ROOT +
              "/provider" + providerUUID +
              "/identity" + identityUUID +
              "/volume"
            );

        var volume = new Volume({
          name: volumeName,
          size: volumeSize,
          description: "",
          status: "creating",
          provider: {
            id: identity.get('provider').id,
            uuid: identity.get('provider').uuid
          },
          identity: {
            id: identity.id,
            uuid: identity.get('uuid')
          },
          projects: [project.id]
        }, {parse: true});

        Utils.dispatch(VolumeConstants.ADD_VOLUME, {volume: volume});

        // todo: hook this back up if experience seems to slow...not connected right now
        // Utils.dispatch(ProjectVolumeConstants.ADD_PENDING_VOLUME_TO_PROJECT, {
        //   volume: volume,
        //   project: project
        // });

        volume.createOnV1Endpoint({
          name: volumeName,
          size: volumeSize
        }).done(function (attrs, status, response) {
          volume.set('id', attrs.id);
          volume.fetch().done(function(){
            // todo: remove hack and start using ProjectVolume endpoint to discover
            // which project an volume is in
            volume.set('projects', [project.id]);

            Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
            Utils.dispatch(VolumeConstants.POLL_VOLUME, {volume: volume});

            // todo: hook this back up if experience seems to slow...not connected right now
            // Utils.dispatch(ProjectVolumeConstants.REMOVE_PENDING_VOLUME_FROM_PROJECT, {
            //   volume: volume,
            //   project: project
            // });

            actions.ProjectVolumeActions.addVolumeToProject({
              project: project,
              volume: volume
            });
          });
        }).fail(function (response) {
          Utils.dispatch(VolumeConstants.REMOVE_VOLUME, {volume: volume});
          Utils.displayError({title: "Volume could not be created", response: response});

          // todo: hook this back up if experience seems to slow...not connected right now
          // Utils.dispatch(ProjectVolumeConstants.REMOVE_PENDING_VOLUME_FROM_PROJECT, {
          //   volume: volume,
          //   project: project
          // });
        });
      })

    }

  };

});
