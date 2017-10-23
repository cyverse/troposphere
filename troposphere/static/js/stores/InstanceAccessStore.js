import Dispatcher from "dispatchers/Dispatcher";
import BaseStore from "stores/BaseStore";
import InstanceAccessCollection from "collections/InstanceAccessCollection";
import InstanceAccessConstants from "constants/InstanceAccessConstants";
import actions from "actions";

let InstanceAccessStore = BaseStore.extend({
    collection: InstanceAccessCollection,

    getForInstance: function(instance) {
        if(instance == null) {
            return this.fetchModels();
        }
        let instance_uuid = instance.get('uuid'),
            instance_key = "?instance__provider_alias="+instance_uuid,
            query_params = {"instance__provider_alias": instance_uuid};
        if(!this.queryModels[instance_key]) {
            return this.fetchWhere(query_params);
        } else {
            return this.queryModels[instance_key];
        }
    },
});

let store = new InstanceAccessStore();
store.lastUpdated = Date.now();
Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

        case InstanceAccessConstants.ADD_INSTANCE_ACCESS:
            store.add(payload.instance_access_request);
            break;

        case InstanceAccessConstants.UPDATE_INSTANCE_ACCESS:
            store.update(payload.instance_access_request);
            break;

        case InstanceAccessConstants.REMOVE_INSTANCE_ACCESS:
            store.remove(payload.instance_access_request);
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
