import BaseStore from "stores/BaseStore";
import AllocationSourceCollection from "collections/AllocationSourceCollection";

let AllocationSourceStore = BaseStore.extend({
    collection: AllocationSourceCollection
});

let store = new AllocationSourceStore();

export default store;

