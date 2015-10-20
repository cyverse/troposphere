
import _ from 'underscore';
import Dispatcher from 'dispatchers/Dispatcher';
import Store from 'stores/Store';
import Constants from 'constants/ResourceRequestConstants';
import Collection from 'collections/AllocationCollection';
import stores from 'stores';

let _models = null;
let _isFetching = false;

//
// CRUD Operations
//
let fetchModels = function() {
    if (!_models && !_isFetching) {
        _isFetching = true;
        var models = new Collection();
        models.fetch({
            url: models.url + "?page_size=100"
        }).done(function() {
            _isFetching = false;
            _models = models;
            ModelStore.emitChange();
        });
    }
};


//
// Model Store
//
var ModelStore = {

    get: function(modelId) {
        if (!_models) {
            fetchModels();
        } else {
            return _models.get(modelId);
        }
    },

    getAll: function() {
        if (!_models) {
            fetchModels()
        }
        return _models;
    }

};


Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case Constants.EMIT_CHANGE:
            break;

        default:
            return true;
    }

    if (!options.silent) {
        ModelStore.emitChange();
    }

    return true;
});

_.extend(ModelStore, Store);


export default ModelStore;

