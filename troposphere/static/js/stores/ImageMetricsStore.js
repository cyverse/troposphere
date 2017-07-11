import ImageMetricsCollection from "collections/ImageMetricsCollection";
import Dispatcher from "dispatchers/Dispatcher";
import BaseStore from "stores/BaseStore";

var ImageMetricsStore = BaseStore.extend({
    collection: ImageMetricsCollection,

    queryParams: {
        page_size: 1000
    }
});

let store = new ImageMetricsStore();

Dispatcher.register(function(dispatch) {
    /*
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        default:
            return true;
    }
    */

    store.emitChange();

    return true;
});


export default store;
