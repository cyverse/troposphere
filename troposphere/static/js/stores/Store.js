import _ from 'underscore';
import Backbone from 'backbone';

let CHANGE_EVENT = 'change';

let Store = {
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.off(CHANGE_EVENT, callback);
    },
    emitChange: function() {
        this.trigger(CHANGE_EVENT);
    }
};

_.extend(Store, Backbone.Events);

export default Store;
