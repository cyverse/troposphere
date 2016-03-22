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

    switch (actionType) {
/*
        case HelpLinkConstants.ADD_LINK:
            store.add(payload.external_link);
            break;

        case HelpLinkConstants.UPDATE_LINK:
            store.update(payload.external_link);
            break;
 */
        default:
            return true;
    }

    if (!options.silent) {
      store.emitChange();
    }

    return true;
  });

export default store;
