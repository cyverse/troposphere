define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      ImageBookmarkConstants = require('constants/ImageBookmarkConstants'),
      ImageBookmark = require('models/ImageBookmark'),
      Utils = require('./Utils'),
      stores = require('stores');

  return {

    addBookmark: function(params, options){
      if(!params.image) throw new Error("Missing image");

      var image = params.image,
          imageBookmark = new ImageBookmark(),
          data = {
            image: image.id
          };

      imageBookmark.save(null, { attrs: data }).done(function(){
        Utils.dispatch(ImageBookmarkConstants.ADD_IMAGE_BOOKMARK, {imageBookmark: imageBookmark}, options);
      });
    },

    removeBookmark: function(params, options){
      if(!params.image) throw new Error("Missing image");

      var image = params.image,
          imageBookmark = stores.ImageBookmarkStore.getImageBookmarkFor(image);

      imageBookmark.destroy().done(function(){
        Utils.dispatch(ImageBookmarkConstants.REMOVE_IMAGE_BOOKMARK, {imageBookmark: imageBookmark}, options);
      });
    }

  };

});
