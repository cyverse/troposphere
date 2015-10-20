
import BaseStore from 'stores/BaseStore';
import globals from 'globals';
import BadgeCollection from 'collections/BadgeCollection';

let BadgeStore = BaseStore.extend({
    collection: BadgeCollection
});

let store = new BadgeStore();

export default store;
