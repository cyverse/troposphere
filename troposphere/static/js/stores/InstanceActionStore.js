import _ from "underscore";
//import Backbone from "backbone";

import Store from "stores/Store";
import Dispatcher from "dispatchers/Dispatcher";
import InstanceActionCollection from "collections/InstanceActionCollection";
//import InstanceAction from "models/InstanceAction";
//import NotificationController from "controllers/NotificationController";

//import globals from "globals";


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


Dispatcher.register(function(payload) {
    var action = payload.action;

    // right now, we want to observer Instance Status changes,
    // and dispatcher whenever that happens ...

    // Action to handle yet; However, we want to
    // signal when a change is emitted
    switch (action.actionType) {
        default:
            break;
    }

    InstanceActionStore.emitChange();

    return true;
});


export default InstanceActionStore;
