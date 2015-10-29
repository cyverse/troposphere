import AppDispatcher from 'dispatchers/AppDispatcher';
import ImageVersionMembershipConstants from 'constants/ImageVersionMembershipConstants';
import ImageVersionMembership from 'models/ImageVersionMembership';
import Utils from './Utils';
import stores from 'stores';

export default {

    add: function(params){
      if(!params.image_version) throw new Error("Missing image_version");
      if(!params.group) throw new Error("Missing group");

      var image_version = params.image_version,
          membership = params.group,
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
      if(!params.group) throw new Error("Missing group");

      var image_version = params.image_version,
          membership = params.group,
          imageVersionMembership = stores.ImageVersionMembershipStore.findOne({
            'image_version.id': image_version.id,
            'group.id': membership.id
          });

      imageVersionMembership.destroy().done(function(){
        Utils.dispatch(ImageVersionMembershipConstants.REMOVE_IMAGEVERSION_MEMBERSHIP, {image_versionMembership: imageVersionMembership});
      }).fail(function(response){
        Utils.displayError({title: "Membership could not be removed from ImageVersion", response: response});
      });
    }

  };
