
import moment from "moment";
import ImageMetricsCollection from "collections/ImageMetricsCollection";
import ProviderCollection from "collections/ProviderCollection";
import ProviderMachineCollection from "collections/ProviderMachineCollection";
import Dispatcher from "dispatchers/Dispatcher";
import BaseStore from "stores/BaseStore";
import stores from "stores";
import NotificationController from "controllers/NotificationController";

var ImageMetricsStore = BaseStore.extend({
    collection: ImageMetricsCollection,

    queryParams: {
        page_size: 1000
    },
});

let store = new ImageMetricsStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        default:
            return true;
    }

    store.emitChange();

    return true;
});


export default store;
