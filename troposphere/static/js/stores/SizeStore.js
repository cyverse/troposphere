
import BaseStore from 'stores/BaseStore';
import SizeCollection from 'collections/SizeCollection';

let SizeStore = BaseStore.extend({
    collection: SizeCollection,

    queryParams: {
        page_size: 100
    }
});

let store = new SizeStore();

export default store;
