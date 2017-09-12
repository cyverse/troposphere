
import Dispatcher from "dispatchers/Dispatcher";
import BaseStore from "stores/BaseStore";
import ImagePatternMatchCollection from "collections/ImagePatternMatchCollection";
import ImagePatternMatchConstants from "constants/ImagePatternMatchConstants";
import PatternMatchCollection from "collections/PatternMatchCollection";
import PatternMatch from "models/PatternMatch";

let _modelsFor = {};
let _isFetchingFor = {};

let ImagePatternMatchStore = BaseStore.extend({
    collection: ImagePatternMatchCollection,

    initialize: function() {
        this.models = new ImagePatternMatchCollection();
    },

    fetchModelsFor: function(imageId) {
        if (!_modelsFor[imageId] && !_isFetchingFor[imageId]) {
            _isFetchingFor[imageId] = true;
            var models = new ImagePatternMatchCollection();
            models.fetch({
                url: models.url + "?version_id=" + imageId
            }).done(function() {
                _isFetchingFor[imageId] = false;

                // add models to existing cache
                this.models.add(models.models);

                // convert ImagePatternMatch collection to a PatternMatchCollection
                var licenses = models.map(function(image_pattern_match) {
                    return new PatternMatch(image_pattern_match.get("pattern_match"), {
                        parse: true
                    });
                });
                licenses = new PatternMatchCollection(licenses);

                _modelsFor[imageId] = licenses;
                this.emitChange();
            }.bind(this));
        }
    },

    getPatternMatchsFor: function(imageversion) {
        if (!_modelsFor[imageversion.id]) return this.fetchModelsFor(imageversion.id);

        // convert ImagePatternMatch collection to an PatternMatchCollection
        var imagePatternMatchs = this.models.filter(function(image_pattern_match) {
            return image_pattern_match.get("image").id === imageversion.id;
        });

        var licenses = imagePatternMatchs.map(function(image_pattern_match) {
            return new PatternMatch(image_pattern_match.get("pattern_match"), {
                parse: true
            });
        });
        return new PatternMatchCollection(licenses);
    }

});

let store = new ImagePatternMatchStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

        case ImagePatternMatchConstants.ADD_IMAGE_PATTERN_MATCH:
            store.add(payload.imagePatternMatch);
            break;

        case ImagePatternMatchConstants.REMOVE_IMAGE_PATTERN_MATCH:
            store.remove(payload.imagePatternMatch);
            break;

        case ImagePatternMatchConstants.EMIT_CHANGE:
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
