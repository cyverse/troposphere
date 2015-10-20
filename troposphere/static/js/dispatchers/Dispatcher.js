
import Q from 'q';
import _ from 'underscore';

let _callbacks = [];
let _promises = [];

let _addPromise = function(cb, payload) {
    var defer = Q.defer();
    if (cb(payload)) {
        defer.resolve(payload);
    } else {
        defer.reject(new Error("Dispatcher callback unsuccessful"));
    }

    _promises.push(defer.promise);
};

let _clearPromises = function() {
    _promises = [];
};

let Dispatcher = {
    register: function(cb) {
        _callbacks.push(cb);
        return _callbacks.length - 1;
    },

    dispatch: function(payload) {
        _.each(_callbacks, function(cb) {
            _addPromise(cb, payload);
        });
        Q.all(_promises).done(_clearPromises);
    },

    waitFor: function( /*array*/ promiseIndexes, /*function*/ callback) {
        var selectedPromises = _.map(promiseIndexes, function(index) {
            return _promises[index];
        });
        return Q.all(selectedPromises).done(callback);
    }
};

export default Dispatcher;
