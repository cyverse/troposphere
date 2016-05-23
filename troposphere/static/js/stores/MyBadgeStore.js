
import BaseStore from 'stores/BaseStore';
import stores from 'stores';
import globals from 'globals';
import BadgeConstants from 'constants/BadgeConstants';
import Dispatcher from 'dispatchers/Dispatcher';
import MyBadgeCollection from 'collections/MyBadgeCollection';

let MyBadgeStore = BaseStore.extend({
    collection: MyBadgeCollection
});

let store = new MyBadgeStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case BadgeConstants.GRANT_BADGE:
            store.add(payload.badge);
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
