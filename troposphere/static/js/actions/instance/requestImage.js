define(function (require) {
  "use strict";

  var globals = require('globals'),
      NotificationController = require('controllers/NotificationController'),
      stores = require('stores'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceImageModal = require('components/modals/instance/InstanceImageModal.react'),
      Utils = require('../Utils');

  return {

    requestImage: function(params){
      if(!params.instance) throw new Error("Missing instance");

      var instance = params.instance,
          modal = InstanceImageModal({
            instance: instance
          });

      ModalHelpers.renderModal(modal, function (details) {
        var tagNames,
            requestData,
            providerId,
            identityId,
            requestUrl;

        tagNames = details.tags.map(function(tag){
          return tag.get('name');
        });

        requestData = {
          instance: instance.id,
          ip_address: instance.get("ip_address"),
          name: details.name,
          description: details.description,
          tags: tagNames,
          provider: details.providerId,
          software: details.software,
          exclude: details.filesToExclude,
          sys: details.systemFiles,
          vis: "public"
        };

        providerId = instance.get('provider').uuid;
        identityId = instance.get('identity').uuid;
        requestUrl = globals.API_ROOT + "/provider/" + providerId + "/identity/" + identityId + "/request_image";

        $.ajax({
          url: requestUrl,
          type: 'POST',
          data: JSON.stringify(requestData),
          dataType: 'json',
          contentType: 'application/json',
          success: function (model) {
            Utils.displaySuccess({message: "Your image request has been sent to support."});
          },
          error: function (response, status, error) {
            Utils.displayError({title: "Your image request could not be sent", response: response});
          }
        });
      })
    }

  };

});
