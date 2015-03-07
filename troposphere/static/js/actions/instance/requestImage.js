define(function (require) {
  "use strict";

  var globals = require('globals'),
      NotificationController = require('controllers/NotificationController'),
      stores = require('stores'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceImageModal = require('components/modals/instance/InstanceImageModal.react'),
      Utils = require('./Utils');

  return {
    requestImage: function(instance){
      var tags = stores.TagStore.getAll();

      var modal = InstanceImageModal({
        instance: instance,
        tags: tags
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

        providerId = instance.getCreds().provider_id;
        identityId = instance.getCreds().identity_id;
        requestUrl = globals.API_ROOT + "/provider/" + providerId + "/identity/" + identityId + "/request_image" + globals.slash();

        $.ajax({
          url: requestUrl,
          type: 'POST',
          data: JSON.stringify(requestData),
          dataType: 'json',
          contentType: 'application/json',
          success: function (model) {
            NotificationController.info(null, "An image of your instance has been requested");
          },
          error: function (response, status, error) {
            if(response && response.responseJSON && response.responseJSON.errors){
              var errors = response.responseJSON.errors;
              var error = errors[0];
              NotificationController.error("An image of your instance could not be requested.", error.message);
            }else{
              NotificationController.error("An image of your instance could not be requested", "If the problem persists, please report the instance.");
            }
          }
        });
      })
    }
  };

});
