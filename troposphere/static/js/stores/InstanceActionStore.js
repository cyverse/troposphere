import _ from "underscore";

import Store from "stores/Store";
import Dispatcher from "dispatchers/Dispatcher";
import InstanceConstants from "constants/InstanceConstants";
import InstanceActionCollection from "collections/InstanceActionCollection";


const InstanceActionStore = function(attributes, options) {
    this.models = null;

    // isFetching: True or false depending on whether this.models is being
    // fetch from the server. Used to prevent multiple server calls for the same data.
    this.isFetching = false;
}

/**
 * The (Generic) Store provides Events and `emitChange`
 */
_.extend(InstanceActionStore, Store, {
    collection: InstanceActionCollection,

    getActionsFor(instance) {
        if (!this.models) {
            return this.fetchFor(instance.get("uuid"));
        } else {
            return this.models;
        }
    },

    updateActionsFor(instance) {
        return this.fetchFor(instance.get("uuid"));
    },

    fetchFor(alias) {
        // alter to a "fetch every time" pattern
        if (!this.isFetching) {
            this.isFetching = true;
            // pass instance alias as `options` to the collection
            // the :alias attribute is used in fetching _context_
            // *specific* instance actions - the status of an
            // instance will determine the possible actions available
            var models = new this.collection(null, { alias });

            models.fetch().done(() => {
                this.isFetching = false;
                this.models = models;
                this.emitChange();
            });
        }
    }
});



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
