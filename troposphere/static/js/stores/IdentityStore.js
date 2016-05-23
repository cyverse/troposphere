
import BaseStore from 'stores/BaseStore';
import IdentityCollection from 'collections/IdentityCollection';

let IdentityStore = BaseStore.extend({
    collection: IdentityCollection
});

let store = new IdentityStore();

export default store;
