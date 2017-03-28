import _ from "underscore";

import Dispatcher from "dispatchers/Dispatcher";
import BaseStore from "stores/BaseStore";
import InstanceCollection from "collections/InstanceCollection";
import context from "context";
import Utils from "actions/Utils";
import InstanceConstants from "constants/InstanceConstants";
import ProjectInstanceConstants from "constants/ProjectInstanceConstants";
import InstanceState from "models/InstanceState";


var InstanceStore = BaseStore.extend({
    collection: InstanceCollection,

    queryParams: {
        page_size: 1000
    },

    initialize: function() {
        this.pollingEnabled = true;
        this.pollingFrequency = 10 * 1000;
    },

    // ----------------
    // Custom functions
    // ----------------

    fetchModels: function() {
        if (!this.models && !this.isFetching) {
            this.isFetching = true;
            var models = new this.collection();
            var queryString = "";

            // Build the query string if queryParameters have been provided
            if (this.queryParams) {
                queryString = this.buildQueryStringFromQueryParams(this.queryParams);
            }

            models.fetch({
                url: _.result(models, "url") + queryString
            }).done(function() {
                this.isFetching = false;
                this.models = models;
                let self = this;
                if (this.pollingEnabled) {
                    this.models.each(function(instance) {
                        let instance_status = instance.get("status"),
                            instance_activity = instance.get("activity");
                        if( (instance_status == "active" || instance_status == "shutoff" || instance_status == "suspended") && instance_activity == "") {
                            return;
                        }
                        self.pollNowUntilBuildIsFinished(instance);
                    });
                }
                this.emitChange();
            }.bind(this));
        }
    },
    getInstancesForIdentity: function(identity) {
        if (!this.models) return this.fetchModels();

        var instances = this.models.filter(function(instance) {
            return instance.get("identity").uuid === identity.get('uuid');
        });

        return new InstanceCollection(instances);
    },

    getInstancesNotInAProject: function(provider) {
        if (!this.models) return this.fetchModels();

        let profile = context.profile,
            username =  profile.get('username');
        var instances = this.models.filter(function(instance) {
            return (instance.get("project") == null && instance.get('user').username == username);
        });

        return new InstanceCollection(instances);
    },

    getTotalResources: function(providerId) {
        if (!this.models) return this.fetchModels();

        let total = {
            cpu: 0,
            mem: 0,
            disk: 0
        };

        this.models.forEach(function(item) {
            if (providerId == item.get("identity").provider) {
                total.cpu = total.cpu += item.get("size").cpu;
                total.mem = total.mem += item.get("size").mem;
                total.disk = total.disk += item.get("size").disk;
            }
        });
        return total;
    },

    // -----------------
    // Polling functions
    // -----------------

    /**
     * Poll handler, last chance to signal updates for resource
     */
    isInFinalState: function(instance) {

        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
            instance: instance
        });

        if (instance.get("state").get("status") == "active" &&
            instance.get("ip_address").charAt(0) == "0") {
            return false;
        }

        return instance.get("state").isInFinalState();
    },

    // Poll for a model
    pollUntilDeleted: function(instance) {
        this.pollWhile(instance, function(model, response) {
            // If 404 then remove the model
            if (response.status == "404") {
                Utils.dispatch(InstanceConstants.REMOVE_INSTANCE, {
                    instance: model
                });
                // This is a hack. Some components only listen to the
                // ProjectInstanceStore. We need them to react when an
                // instance is deleted, so we prompt the addChangeListeners of
                // each of those components here.
                Utils.dispatch(ProjectInstanceConstants.EMIT_CHANGE);

                return false;
            }

            var status = instance.get("state").get("status");
            instance.set({
                state: new InstanceState({
                    status_raw: status + " - deleting",
                    status: "active",
                    activity: "deleting"
                })
            });

            Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
                instance: instance
            });

            // Keep polling while 200 or not 404
            return response.status == "200";

        }.bind(this));
    }

});

let store = new InstanceStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

        case InstanceConstants.ADD_INSTANCE:
            store.add(payload.instance);
            break;

        case InstanceConstants.UPDATE_INSTANCE:
            store.update(payload.instance);
            break;

        case InstanceConstants.REMOVE_INSTANCE:
            store.remove(payload.instance);
            break;

        case InstanceConstants.POLL_INSTANCE:
            // This happens whether or not polling is enabled in basestore (seems unintuitive)
            store.pollNowUntilBuildIsFinished(payload.instance);
            break;

        case InstanceConstants.POLL_INSTANCE_WITH_DELAY:
            store.pollUntilBuildIsFinished(payload.instance, payload.delay);
            break;

        case InstanceConstants.POLL_FOR_DELETED:
            store.pollUntilDeleted(payload.instance);
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
