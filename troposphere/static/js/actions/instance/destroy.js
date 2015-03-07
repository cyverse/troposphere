define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      InstanceState = require('models/InstanceState'),
      actions = require('actions'),
      NotificationController = require('controllers/NotificationController'),
      stores = require('stores'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceDeleteModal = require('components/modals/instance/InstanceDeleteModal.react'),
      ExplainInstanceDeleteConditionsModal = require('components/modals/instance/ExplainInstanceDeleteConditionsModal.react'),
      Utils = require('./Utils');

  return {

    terminate: function(payload, options){
      var instance = payload.instance;
      var redirectUrl = payload.redirectUrl;

      var attachedVolumes = stores.VolumeStore.getVolumesAttachedToInstance(instance);
      if(attachedVolumes.length > 0){
        var modal = ExplainInstanceDeleteConditionsModal({
          attachedVolumes: attachedVolumes,
          backdrop: 'static'
        });

        ModalHelpers.renderModal(modal, function(){});

      }else{
        var modal = InstanceDeleteModal({
          instance: payload.instance
        });

        ModalHelpers.renderModal(modal, function () {
          this.terminate_noModal(payload, options);
          if(redirectUrl) Backbone.history.navigate(redirectUrl, {trigger: true});
        }.bind(this));

      }
    },

    terminate_noModal: function(payload, options){
      var instance = payload.instance;
      var project = payload.project;

      var instanceState = new InstanceState({status_raw: "deleting"});
      var originalState = instance.get('state');
      instance.set({state: instanceState});
      Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

      instance.destroy().done(function () {
        Utils.dispatch(InstanceConstants.REMOVE_INSTANCE, {instance: instance});
        actions.ProjectInstanceActions.removeInstanceFromProject(instance, project);

      }).fail(function (response) {
        instance.set({state: originalState});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});

        if(response && response.responseJSON && response.responseJSON.errors){
            var errors = response.responseJSON.errors;
            var error = errors[0];
            NotificationController.error("Your instance could not be deleted.", error.message);
         }else{
            NotificationController.error("Your instance could not be deleted", "If the problem persists, please report the instance.");
         }
      });
    }

  };

});
