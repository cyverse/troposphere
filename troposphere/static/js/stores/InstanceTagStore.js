
import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import InstanceTagCollection from 'collections/InstanceTagCollection';
import InstanceTagConstants from 'constants/InstanceTagConstants';
import TagCollection from 'collections/TagCollection';
import Tag from 'models/Tag';

let _modelsFor = {};
let _isFetchingFor = {};

let InstanceTagStore = BaseStore.extend({
    collection: InstanceTagCollection,

    initialize: function() {
        this.models = new InstanceTagCollection();
    },

    fetchModelsFor: function(instanceId) {
        if (!_modelsFor[instanceId] && !_isFetchingFor[instanceId]) {
            _isFetchingFor[instanceId] = true;
            var models = new InstanceTagCollection();
            models.fetch({
                url: models.url + "?instance__id=" + instanceId
            }).done(function() {
                _isFetchingFor[instanceId] = false;

                // add models to existing cache
                this.models.add(models.models);

                // convert InstanceTag collection to a TagCollection
                var tags = models.map(function(it) {
                    return new Tag(it.get('tag'), {
                        parse: true
                    });
                });
                tags = new TagCollection(tags);

                _modelsFor[instanceId] = tags;
                this.emitChange();
            }.bind(this));
        }
    },

    getTagsFor: function(instance) {
        if (!_modelsFor[instance.id]) return this.fetchModelsFor(instance.id);

        // convert InstanceTag collection to an TagCollection
        var instanceTags = this.models.filter(function(it) {
            return it.get('instance').id === instance.id;
        });

        var tags = instanceTags.map(function(it) {
            return new Tag(it.get('tag'), {
                parse: true
            });
        });
        return new TagCollection(tags);
    }

});

let store = new InstanceTagStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

        case InstanceTagConstants.ADD_INSTANCE_TAG:
            store.add(payload.instanceTag);
            break;

        case InstanceTagConstants.REMOVE_INSTANCE_TAG:
            store.remove(payload.instanceTag);
            break;

        case InstanceTagConstants.EMIT_CHANGE:
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
