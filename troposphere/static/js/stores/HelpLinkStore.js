import _ from "underscore";
import Dispatcher from "dispatchers/Dispatcher";
import BaseStore from "stores/BaseStore";
import HelpLinkCollection from "collections/HelpLinkCollection";

var HelpLinkStore = BaseStore.extend({
    collection: HelpLinkCollection,

    queryParams: {
        page_size: 100
    }

});

var store = new HelpLinkStore();

Dispatcher.register(function(dispatch) {
    var options = dispatch.action.options || options;

    if (_.has(options, "silent") && !options.silent) {
        store.emitChange();
    }

    return true;
});

export default store;
