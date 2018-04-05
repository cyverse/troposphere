import Dispatcher from "dispatchers/Dispatcher";
import BaseStore from "stores/BaseStore";
import context from "context";
import Utils from "actions/Utils";
import VolumeCollection from "collections/VolumeCollection";
import VolumeConstants from "constants/VolumeConstants";
import VolumeState from "models/VolumeState";

let VolumeStore = BaseStore.extend({
    collection: VolumeCollection,

    queryParams: {
        page_size: 100
    },

    initialize: function() {
        this.pollingEnabled = true;
        this.pollingFrequency = 10 * 1000;
    },

    //
    // Custom functions
    //
    getVolumesForIdentity: function(identity) {
        if (!this.models) return this.fetchModels();

        var volumes = this.models.filter(function(volume) {
            return volume.get("identity").uuid === identity.get('uuid');
        });

        return new VolumeCollection(volumes);
    },

    getVolumesAttachedToInstance: function(instance) {
        if (!this.models) return this.fetchModels();

        var uuid = instance.get("uuid");

        var attachedVolumes = this.models.filter(function(volume) {
            var attachData = volume.get("attach_data");
            return attachData.instance_id && attachData.instance_id === uuid;
        });

        return new VolumeCollection(attachedVolumes);
    },

    getVolumesAttachedToInstances: function(instances) {
        if (!this.models) return this.fetchModels();

        let uuids = instances.pluck("uuid") || [],
            matches = [];

        let attachedVolumes = this.models.filter(function(volume) {
            let attachData = volume.get("attach_data"),
                isAttached = attachData.instance_id && uuids.includes(attachData.instance_id);

            // generate a matched list of UUIDs of the instances with attached volumes
            if (isAttached) {
                matches.push(attachData.instance_id);
            }

            return isAttached
        });

        return {
            matchedIds: matches,
            volumes: new VolumeCollection(attachedVolumes)
        };
    },

    // Makes a clean list of attached resources from volume information for easy reference
    getAttachedResources: function() {
        if (!this.models) return this.fetchModels();
        var attachedResources = [];
        this.models.each(function(volume) {
            var attachData = volume.get("attach_data");
            if (attachData && attachData.instance_id) {
                attachedResources.push(volume.get("uuid"));
                attachedResources.push(attachData.instance_id);
            }
        });
        return attachedResources;
    },


    getVolumesNotInAProject: function() {
        if (!this.models) return this.fetchModels();
        let profile = context.profile,
            username =  profile.get('username');
        var volumes = this.models.filter(function(volume) {
            return (volume.get("project") == null && volume.get('user').username == username);
        });

        return new VolumeCollection(volumes);
    },

    //
    // Polling functions
    //

    isInFinalState: function(volume) {
        return volume.get("state").isInFinalState();
    },

    // Poll for a model
    pollUntilDetached: function(volume) {
        this.pollWhile(volume, function(model, response) {
            var status = volume.get("state").get("status");
            var responseIs200 = String(response.status)[0] == "2";

            var keepPolling = status != "available" && responseIs200;

            if (keepPolling) {
                volume.set({
                    state: new VolumeState({
                        status_raw: "detaching"
                    })
                });
            }
            Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {
                volume: volume
            });

            return keepPolling;
        }.bind(this));
    }

});


let store = new VolumeStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

        case VolumeConstants.ADD_VOLUME:
            store.add(payload.volume);
            break;

        case VolumeConstants.UPDATE_VOLUME:
            store.update(payload.volume);
            break;

        case VolumeConstants.REMOVE_VOLUME:
            store.remove(payload.volume);
            break;

        case VolumeConstants.POLL_VOLUME:
            store.pollNowUntilBuildIsFinished(payload.volume);
            break;

        case VolumeConstants.POLL_VOLUME_WITH_DELAY:
            store.pollUntilBuildIsFinished(payload.volume, payload.delay);
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
