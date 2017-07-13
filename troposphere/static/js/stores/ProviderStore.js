import BaseStore from "stores/BaseStore";
import Dispatcher from "dispatchers/Dispatcher";
import ProviderCollection from "collections/ProviderCollection";
import ProviderConstants from "constants/ProviderConstants";

let ProviderStore = BaseStore.extend({
    collection: ProviderCollection,

    getProvidersForVersion: function(version) {
        if (!this.models) {
            this.fetchModels();
        } else {
            let providers = this.models;
            let versionProviders = version.get("machines").map(m => m.provider.id);

            // Return version providers (but prefer our models)
            return providers.cfilter(prov => {
                return versionProviders.includes(prov.id);
            });
        }
    }

});

let store = new ProviderStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    // Payload not used in current implementation
    // var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

        case ProviderConstants.UPDATE_PROVIDER:
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
