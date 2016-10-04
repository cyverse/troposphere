import BaseStore from "stores/BaseStore";
import ProviderCollection from "collections/ProviderCollection";

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
    },

});

let store = new ProviderStore();

export default store;
