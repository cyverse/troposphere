import Dispatcher from "dispatchers/Dispatcher";
import BaseStore from "stores/BaseStore";
import ProjectCollection from "collections/ProjectCollection";
import ProjectConstants from "constants/ProjectConstants";

let ProjectStore = BaseStore.extend({
    collection: ProjectCollection,

    getProjectsForIdentity: function(identityObj) {
        if (!this.models) {
            return this.fetchModels();
        }
        let identity_key = "?identity_uuid="+identityObj.uuid,
            query_params = {"identity_uuid" : identityObj.uuid};
        if (!this.queryModels[identity_key]) {
            return this.fetchWhere(query_params);
        } else {
            return this.queryModels[identity_key];
        }
    }

});

let store = new ProjectStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

        case ProjectConstants.ADD_PROJECT:
            store.add(payload.project);
            break;

        case ProjectConstants.UPDATE_PROJECT:
            store.update(payload.project);
            break;

        case ProjectConstants.REMOVE_PROJECT:
            store.remove(payload.project);
            break;

        case ProjectConstants.EMIT_CHANGE:
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
