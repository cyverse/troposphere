import _ from "underscore";

import Store from "stores/Store";
import Dispatcher from "dispatchers/Dispatcher";
import InstanceConstants from "constants/InstanceConstants";
import InstanceActionCollection from "collections/InstanceActionCollection";


let _modelsFor = {};
let _isFetchingFor = {};


const InstanceActionStore = {
    collection: InstanceActionCollection,

    contains(instance) {
        let alias = instance.get("uuid");
        return _.has(_modelsFor, alias);
    },

    isFetching(alias) {
        return _.has(_isFetchingFor, alias) && _isFetchingFor[alias];
    },

    clear(instance) {
        let alias = instance.get("uuid");
        _modelsFor[alias] = null;
    },

    getActionsFor(instance) {
        let alias = instance.get("uuid");
        if (!this.contains(instance)) {
            return this.fetchFor(alias);
        } else {
            return _modelsFor[alias];
        }
    },

    updateActionsFor(instance) {
        return this.fetchFor(instance.get("uuid"));
    },

    fetchFor(alias) {
        // alter to a "fetch every time" pattern
        if (!this.isFetching(alias)) {
            _isFetchingFor[alias] = true;
            // pass instance alias as `options` to the collection
            // the :alias attribute is used in fetching _context_
            // *specific* instance actions - the status of an
            // instance will determine the possible actions available
            var models = new this.collection(null, { alias });

            models.fetch().done(() => {
                _isFetchingFor[alias] = false;
                _modelsFor[alias] = models;
                this.emitChange();
            });
        }
    }
};

/**
 * Extend the (Generic) "store/Store" to listeners, `emitChange`, & Events
 */
_.extend(InstanceActionStore, Store);


Dispatcher.register(function(dispatch) {
    let { actionType, payload } = dispatch.action;

    // ---
    // right now, we want to observer Instance Status changes,
    // and dispatcher whenever that happens ...
    //
    // In the case there has been an update - we want to do eager
    // reload the actions available:
    switch (actionType) {
        case InstanceConstants.UPDATE_INSTANCE:
            InstanceActionStore.updateActionsFor(payload.instance);
            break;
        case InstanceConstants.POLL_INSTANCE_WITH_DELAY:
            InstanceActionStore.updateActionsFor(payload.instance);
            break;
        case InstanceConstants.POLL_INSTANCE:
            InstanceActionStore.updateActionsFor(payload.instance);
            break;
        default:
            break;
    }

    InstanceActionStore.emitChange();

    return true;
});


export default InstanceActionStore;
