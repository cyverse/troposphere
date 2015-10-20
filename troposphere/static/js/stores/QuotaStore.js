
import BaseStore from 'stores/BaseStore';
import QuotaCollection from 'collections/QuotaCollection';

let QuotaStore = BaseStore.extend({
    collection: QuotaCollection,

    queryParams: {
        page_size: 100
    }
});

let store = new QuotaStore();

export default store;

