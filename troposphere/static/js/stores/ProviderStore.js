import BaseStore from 'stores/BaseStore';
import ProviderCollection from 'collections/ProviderCollection';

let ProviderStore = BaseStore.extend({
    collection: ProviderCollection
});

let store = new ProviderStore();

export default store;
