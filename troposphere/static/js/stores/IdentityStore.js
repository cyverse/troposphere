import BaseStore from "stores/BaseStore";
import Dispatcher from "dispatchers/Dispatcher";
import IdentityCollection from "collections/IdentityCollection";
import AccountConstants from "constants/AccountConstants";

let IdentityStore = BaseStore.extend({
    collection: IdentityCollection,

    getIdentitiesForProject: function(project) {
        if (project == null) {
            return this.fetchModels();
        }
        let project_key = "?project_id="+project.id,
            query_params = {"project_id" : project.id};
        if (!this.queryModels[project_key]) {
            return this.fetchWhere(query_params);
        } else {
            return this.queryModels[project_key];
        }
    },

    getIdentitiesForProvider: function(provider) {
        if (!this.models) {
            this.fetchModels();
        } else {
            let identities = this.models;
            let versionIdentities = identities.cfilter(ident => {
                return ident.get('provider').id == provider.id;
            });
            return versionIdentities;
        }
    },

});

let store = new IdentityStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    // Payload not used in current implementation
    //var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

        case AccountConstants.UPDATE_ACCOUNT:
            store.clearCache();
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
