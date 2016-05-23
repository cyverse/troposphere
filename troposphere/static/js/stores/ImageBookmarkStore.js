
import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import ImageBookmarkCollection from 'collections/ImageBookmarkCollection';
import ImageBookmarkConstants from 'constants/ImageBookmarkConstants';
import actions from 'actions';
import ImageCollection from 'collections/ImageCollection';
import stores from 'stores';

let ImageBookmarkStore = BaseStore.extend({
    collection: ImageBookmarkCollection,

    getAllAndCheckBadges: function() {
        this.getAll();
        this.addChangeListener(function() {
            actions.BadgeActions.checkBookmarkBadges();
        });
    },

    getBookmarkedImages: function() {
        if (!this.models) return this.fetchModels();
        var haveAllImages = true;

        var images = this.models.map(function(ib) {
            // this will cause the image to be fetched if we don't yet have it
            var image = stores.ImageStore.get(ib.get('image').id);
            if (!image) haveAllImages = false;
            return image;
        });

        if (!haveAllImages) return null;
        // Check the user's badges when we know we have all of their bookmarked images
        return new ImageCollection(images);
    }

});

let store = new ImageBookmarkStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

        case ImageBookmarkConstants.ADD_IMAGE_BOOKMARK:
            store.add(payload.imageBookmark);
            break;

        case ImageBookmarkConstants.REMOVE_IMAGE_BOOKMARK:
            store.remove(payload.imageBookmark);
            break;

        case ImageBookmarkConstants.EMIT_CHANGE:
            break;

        default:
            return true;
    }

    if (!options.silent) {
        store.emitChange();
    }

    return true;
});


export default store;
