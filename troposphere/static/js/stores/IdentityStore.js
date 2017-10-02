import BaseStore from "stores/BaseStore";
import Dispatcher from "dispatchers/Dispatcher";
import IdentityCollection from "collections/IdentityCollection";
import AccountConstants from "constants/AccountConstants";

let IdentityStore = BaseStore.extend({
    collection: IdentityCollection,

    ownedIdentities: function(username) {
        if (!this.models) {
            return this.fetchModels();
        }
        var identities = this.models.filter(function(identity) {
            return identity.get('user').username === username;
        });
        return new IdentityCollection(identities);
    },

    getIdentitiesForGroup: function(group, username) {
        if (!this.models) {
            return this.fetchModels();
        }
        let models = null;
        if (group != null) {
            let group_key = "?group_id="+group.get("id"),
                query_params = {"group_id" : group.get("id")};
            if (!this.queryModels[group_key]) {
                models = this.fetchWhere(query_params);
            } else {
                models = this.queryModels[group_key];
            }
        }
        // Optionally Chaining with 'ownership' filter..
        if(!username || !models) {
            return models;
        }
        var owner_filtered_models = models.cfilter(function(identity) {
            return identity.get('user').username === username;
        });
        return owner_filtered_models;
    },

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
    }

});

let store = new IdentityStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    // Payload not used in current implementation
    // var payload = dispatch.action.payload;
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
