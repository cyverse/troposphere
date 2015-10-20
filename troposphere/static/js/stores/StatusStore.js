
import BaseStore from 'stores/BaseStore';
import StatusCollection from 'collections/StatusCollection';

let StatusStore = BaseStore.extend({
    collection: StatusCollection
});

let store = new StatusStore();

export default store;
