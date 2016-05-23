import AppDispatcher from 'dispatchers/AppDispatcher';
import ImageBookmarkConstants from 'constants/ImageBookmarkConstants';
import ImageBookmark from 'models/ImageBookmark';
import Badges from 'Badges';
import actions from 'actions';
import Utils from './Utils';
import stores from 'stores';

export default {

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
