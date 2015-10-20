
import TagCollection from 'collections/TagCollection';
import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import TagConstants from 'constants/TagConstants';

let _pendingInstanceTags = {};
let _pendingImageTags = {};

let TagStore = BaseStore.extend({
    collection: TagCollection,

    queryParams: {
        page_size: 1000
    },

    getImageTags: function(image) {
        if (!this.models) throw new Error("Must fetch tags before calling getImageTags");

        var imageTagArray = image.get('tags').map(function(tag) {
            //var tagName = tag.name;
            //var tag = _tags.findWhere({name: tagName}, {parse: true});
            //if(!tag) throw new Error("Expected to find a tag with name '" + tagName +"'");
            return tag;
        });

        // Add any pending tags to the result set
        var pendingImageTags = _pendingImageTags[image.id];
        if (pendingImageTags) {
            imageTagArray = imageTagArray.concat(pendingImageTags.models);
        }

        return new TagCollection(imageTagArray);
    },

    addPendingTagToInstance: function(tag, instance) {
        _pendingInstanceTags[instance.id] = _pendingInstanceTags[instance.id] || new TagCollection();
        _pendingInstanceTags[instance.id].add(tag);
    },

    removePendingTagFromInstance: function(tag, instance) {
        _pendingInstanceTags[instance.id].remove(tag);
    },

    addPendingTagToImage: function(tag, image) {
        _pendingImageTags[image.id] = _pendingImageTags[image.id] || new TagCollection();
        _pendingImageTags[image.id].add(tag);
    },

    removePendingTagFromImage: function(tag, image) {
        _pendingImageTags[image.id].remove(tag);
    }

});

let store = new TagStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case TagConstants.ADD_TAG:
            store.add(payload.tag);
            break;

        case TagConstants.UPDATE_TAG:
            store.update(payload.tag);
            break;

        case TagConstants.REMOVE_TAG:
            store.remove(payload.tag);
            break;

        case TagConstants.ADD_PENDING_TAG_TO_INSTANCE:
            store.addPendingTagToInstance(payload.tag, payload.instance);
            break;

        case TagConstants.REMOVE_PENDING_TAG_FROM_INSTANCE:
            store.removePendingTagFromInstance(payload.tag, payload.instance);
            break;

        case TagConstants.ADD_PENDING_TAG_TO_IMAGE:
            store.addPendingTagToImage(payload.tag, payload.image);
            break;

        case TagConstants.REMOVE_PENDING_TAG_FROM_IMAGE:
            store.removePendingTagFromImage(payload.tag, payload.image);
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
