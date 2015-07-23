define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      ImageVersionMembershipConstants = require('constants/ImageVersionMembershipConstants'),
      ImageVersionMembership = require('models/ImageVersionMembership'),
      Utils = require('./Utils'),
      stores = require('stores');

  return {

    add: function(params){
      if(!params.image_version) throw new Error("Missing image_version");
      if(!params.membership) throw new Error("Missing membership");

      var image_version = params.image_version,
          membership = params.membership,
          imageVersionMembership = new ImageVersionMembership(),
          data = {
            image_version: image_version.id,
            group: membership.id
          };

      imageVersionMembership.save(null, {
        attrs: data
      }).done(function(){
        Utils.dispatch(ImageVersionMembershipConstants.ADD_IMAGEVERSION_MEMBERSHIP, {image_versionMembership: imageVersionMembership});
      }).fail(function(response){
        Utils.displayError({title: "Membership could not be added to ImageVersion", response: response});
      });
    },

    remove: function(params){
      if(!params.image_version) throw new Error("Missing image_version");
      if(!params.membership) throw new Error("Missing membership");

      var image_version = params.image_version,
          membership = params.membership,
          imageVersionMembership = stores.ImageVersionMembershipStore.findOne({
            'image_version.id': image_version.id,
            'membership.id': membership.id
          });

      imageVersionMembership.destroy().done(function(){
        Utils.dispatch(ImageVersionMembershipConstants.REMOVE_IMAGEVERSION_MEMBERSHIP, {image_versionMembership: imageVersionMembership});
      }).fail(function(response){
        Utils.displayError({title: "Membership could not be removed from ImageVersion", response: response});
      });
    }

  };

});
