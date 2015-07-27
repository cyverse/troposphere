define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      ImageVersionLicenseConstants = require('constants/ImageVersionLicenseConstants'),
      ImageVersionLicense = require('models/ImageVersionLicense'),
      Utils = require('./Utils'),
      stores = require('stores');

  return {

    add: function(params){
      if(!params.image_version) throw new Error("Missing image_version");
      if(!params.group) throw new Error("Missing group");

      var image_version = params.image_version,
          license = params.group,
          imageVersionLicense = new ImageVersionLicense(),
          data = {
            image_version: image_version.id,
            group: license.id
          };

      imageVersionLicense.save(null, {
        attrs: data
      }).done(function(){
        Utils.dispatch(ImageVersionLicenseConstants.ADD_IMAGEVERSION_LICENSE, {image_versionLicense: imageVersionLicense});
      }).fail(function(response){
        Utils.displayError({title: "License could not be added to ImageVersion", response: response});
      });
    },

    remove: function(params){
      if(!params.image_version) throw new Error("Missing image_version");
      if(!params.group) throw new Error("Missing group");

      var image_version = params.image_version,
          license = params.group,
          imageVersionLicense = stores.ImageVersionLicenseStore.findOne({
            'image_version.id': image_version.id,
            'group.id': license.id
          });

      imageVersionLicense.destroy().done(function(){
        Utils.dispatch(ImageVersionLicenseConstants.REMOVE_IMAGEVERSION_LICENSE, {image_versionLicense: imageVersionLicense});
      }).fail(function(response){
        Utils.displayError({title: "License could not be removed from ImageVersion", response: response});
      });
    }

  };

});
