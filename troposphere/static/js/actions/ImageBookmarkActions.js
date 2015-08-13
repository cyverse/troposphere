define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
    ImageBookmarkConstants = require('constants/ImageBookmarkConstants'),
    ImageBookmark = require('models/ImageBookmark'),
    Badges = require('Badges'),
    actions = require('actions'),
    Utils = require('./Utils'),
    stores = require('stores');

  return {

    addBookmark: function (params, options) {
      if (!params.image) throw new Error("Missing image");

      var image = params.image,
        imageBookmark = new ImageBookmark(),
        data = {
          image: image.id
        };

      imageBookmark.save(null, {attrs: data}).done(function () {
        actions.BadgeActions.checkOrGrant(Badges.FAVORITE_IMAGE_BADGE);
        Utils.dispatch(ImageBookmarkConstants.ADD_IMAGE_BOOKMARK, {imageBookmark: imageBookmark}, options);
      });
    },

    removeBookmark: function (params, options) {
      if (!params.image) throw new Error("Missing image");

      var image = params.image,
        imageBookmark = stores.ImageBookmarkStore.findOne({
          'image.id': image.id
        });

      imageBookmark.destroy().done(function () {
        Utils.dispatch(ImageBookmarkConstants.REMOVE_IMAGE_BOOKMARK, {imageBookmark: imageBookmark}, options);
      });
    }

  };

});
