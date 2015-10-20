import BaseStore from 'stores/BaseStore';
import InstanceHistoryCollection from 'collections/InstanceHistoryCollection';
import actions from 'actions';

let InstanceHistoryStore = BaseStore.extend({
    collection: InstanceHistoryCollection,

    queryParams: {
        page: 1
    }
});

// Fetch models and check badges when data is retreived
InstanceHistoryStore.prototype.getAllAndCheckBadges = function() {
    this.getAll();
    this.addChangeListener(function() {
        actions.BadgeActions.checkInstanceBadges();
    });
};

let store = new InstanceHistoryStore();
store.lastUpdated = Date.now();

export default store;
