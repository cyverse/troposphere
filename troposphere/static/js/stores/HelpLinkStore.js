import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import HelpLinkCollection from 'collections/HelpLinkCollection';

var HelpLinkStore = BaseStore.extend({
    collection: HelpLinkCollection,

    queryParams: {
        page_size: 100
    },

});

var store = new HelpLinkStore();

Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    if (!options.silent) {
        store.emitChange();
    }

    return true;
});

export default store;
