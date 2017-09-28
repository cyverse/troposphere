import PatternMatchCollection from "collections/PatternMatchCollection";
import Dispatcher from "dispatchers/Dispatcher";
import BaseStore from "stores/BaseStore";
import PatternMatchConstants from "constants/PatternMatchConstants";

let _pendingImagePatternMatches = {};

let PatternMatchStore = BaseStore.extend({
    collection: PatternMatchCollection,

    queryParams: {
        page_size: 1000
    },

    getImageAccess: function(image) {
        if (!this.models) {
            this.fetchModels();
            return;
        }

        var imagePatternMatchArray = image.get("access_list").map(function(pattern) {
            //var patternName = pattern.name;
            //var pattern = _patterns.findWhere({name: patternName}, {parse: true});
            //if(!pattern) throw new Error("Expected to find a pattern with name '" + patternName +"'");
            return pattern;
        });

        // Add any pending patterns to the result set
        var pendingImagePatternMatchs = _pendingImagePatternMatches[image.id];
        if (pendingImagePatternMatchs) {
            imagePatternMatchArray = imagePatternMatchArray.concat(pendingImagePatternMatchs.models);
        }

        return new PatternMatchCollection(imagePatternMatchArray);
    },

    addPendingPatternMatchToImage: function(pattern, image) {
        _pendingImagePatternMatches[image.id] = _pendingImagePatternMatches[image.id] || new PatternMatchCollection();
        _pendingImagePatternMatches[image.id].add(pattern);
    },

    removePendingPatternMatchFromImage: function(pattern, image) {
        _pendingImagePatternMatches[image.id].remove(pattern);
    }

});

let store = new PatternMatchStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case PatternMatchConstants.ADD_PATTERN:
            store.add(payload.pattern_match);
            break;

        case PatternMatchConstants.UPDATE_PATTERN:
            store.update(payload.pattern_match);
            break;

        case PatternMatchConstants.REMOVE_PATTERN:
            store.remove(payload.pattern_match);
            break;

        case PatternMatchConstants.ADD_PENDING_PATTERN_TO_IMAGE:
            store.addPendingPatternMatchToImage(payload.pattern_match, payload.image);
            break;

        case PatternMatchConstants.REMOVE_PENDING_PATTERN_FROM_IMAGE:
            store.removePendingPatternMatchFromImage(payload.pattern_match, payload.image);
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
