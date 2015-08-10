define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      ImageVersionScriptConstants = require('constants/ImageVersionScriptConstants'),
      ImageVersionScript = require('models/ImageVersionScript'),
      Utils = require('./Utils'),
      stores = require('stores');

  return {

    add: function(params){
      if(!params.image_version) throw new Error("Missing image_version");
      if(!params.script) throw new Error("Missing script");

      var image_version = params.image_version,
          script = params.script,
          imageVersionScript = new ImageVersionScript(),
          data = {
            image_version: image_version.id,
            boot_script: script.id
          };

      imageVersionScript.save(null, {
        attrs: data
      }).done(function(){
        Utils.dispatch(ImageVersionScriptConstants.ADD_IMAGEVERSION_SCRIPT, {image_versionScript: imageVersionScript});
      }).fail(function(response){
        Utils.displayError({title: "Script could not be added to ImageVersion", response: response});
      });
    },

    remove: function(params){
      if(!params.image_version) throw new Error("Missing image_version");
      if(!params.script) throw new Error("Missing script");

      var image_version = params.image_version,
          script = params.script,
          imageVersionScript = stores.ImageVersionScriptStore.findOne({
            'image_version.id': image_version.id,
            'boot_script.id': script.id
          });

      imageVersionScript.destroy().done(function(){
        Utils.dispatch(ImageVersionScriptConstants.REMOVE_IMAGEVERSION_SCRIPT, {image_versionScript: imageVersionScript});
      }).fail(function(response){
        Utils.displayError({title: "Script could not be removed from ImageVersion", response: response});
      });
    }

  };

});
