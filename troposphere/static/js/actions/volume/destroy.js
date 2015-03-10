define(function (require) {

  var VolumeConstants = require('constants/VolumeConstants'),
      NotificationController = require('controllers/NotificationController'),
      VolumeState = require('models/VolumeState'),
      actions = require('actions'),
      stores = require('stores'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      VolumeDeleteModal = require('components/modals/volume/VolumeDeleteModal.react'),
      ExplainVolumeDeleteConditionsModal = require('components/modals/volume/ExplainVolumeDeleteConditionsModal.react'),
      Utils = require('../Utils'),
      globals = require('globals');

  var _destroy = function(payload, options){
    var volume = payload.volume,
        project = payload.project,
        volumeState = new VolumeState({status_raw: "deleting"}),
        originalState = volume.get('state'),
        identity = volume.get('identity'),
        provider = volume.get('provider'),
        url = (
          globals.API_ROOT +
          "/provider/" + provider.uuid +
          "/identity/" + identity.uuid +
          "/volume/"   + volume.get('uuid')
        );

    // todo: change volume state to show that it's being destroyed

    volume.set({state: volumeState});
    Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});

    volume.destroy({
      url: url
    }).done(function () {
      // todo: the proper thing to do is to poll until the volume is actually destroyed
      // and THEN remove it from the project. Need to find a way to support that.
      Utils.dispatch(VolumeConstants.REMOVE_VOLUME, {volume: volume});
      actions.ProjectVolumeActions.removeVolumeFromProject(volume, project);
    }).fail(function (response) {
      volume.set({state: originalState});
      Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
      Utils.dispatch(VolumeConstants.POLL_VOLUME, {volume: volume});
      Utils.displayError({title: "Your volume could not be deleted", response: response});
    });
  };

  return {

    destroy: function(payload, options){
      var volume = payload.volume,
          redirectUrl = payload.redirectUrl,
          instanceUUID = volume.get('attach_data').instance_id,
          isAttached = !!instanceUUID,
          modal;

      if(isAttached){
        modal = ExplainVolumeDeleteConditionsModal({
          volume: volume,
          instance: stores.InstanceStore.getAll().findWhere({uuid: instanceUUID})
        });
      }else{
        modal = VolumeDeleteModal({
          volume: volume
        });
      }

      ModalHelpers.renderModal(modal, function () {
        if(isAttached) return;
        _destroy(payload, options);
        if(redirectUrl) Backbone.history.navigate(redirectUrl, {trigger: true});
      })
    },

    destroy_noModal: function(payload, options){
      _destroy(payload, options);
    }
  };

});
