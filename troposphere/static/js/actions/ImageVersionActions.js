define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
    Utils = require('./Utils'),
    NotificationController = require('controllers/NotificationController'),

  // Constants
    ImageVersionConstants = require('constants/ImageVersionConstants'),

  // Models
    ImageVersion = require('models/ImageVersion'),

  // Modals
    ModalHelpers = require('components/modals/ModalHelpers');

  return {

    update: function(version, newAttributes) {
      if(!version) throw new Error("Missing Image Version");
      if(!newAttributes) throw new Error("No attributes to be updated");

      version.set(newAttributes);
      Utils.dispatch(ImageVersionConstants.UPDATE_IMAGE_VERSION, {version: version});
      //TODO:
      version.save(newAttributes, {
        patch:true,
      }).done(function(){
        // UPDATE_VERSION here if we do NOT want 'optimistic updating'
        // Othewise, do nothing..
      }).fail(function(){
        var message = "Error creating Image Version " + version.get('name') + ".";
        NotificationController.error(null, message);
        Utils.dispatch(ImageVersionConstants.REMOVE_IMAGE_VERSION, {version: version});
      }).always(function(){
        // todo: add a POLL_IMAGE_VERSION constant if you want this to work (also need
        // to add a handler in the ImageVersionStore)
        //Utils.dispatch(ImageVersionConstants.POLL_IMAGE_VERSION, {version: version});
      });
    },


  }

});

