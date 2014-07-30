define(
  [
    'q',
    'underscore'
  ],
  function (Q, _) {

    var _callbacks = [];
    var _promises = [];

    var _addPromise = function (cb, payload) {
      var defer = Q.defer();
      ;

      if (cb(payload)) {
        defer.resolve(payload);
      } else {
        defer.reject(new Error("Dispatcher callback unsuccessful"));
      }

      _promises.push(defer.promise);
    };

    var _clearPromises = function () {
      _promises = [];
    };

    var Dispatcher = {
      register: function (cb) {
        _callbacks.push(cb);
        return _callbacks.length - 1;
      },

      dispatch: function (payload) {
        _.each(_callbacks, function (cb) {
          _addPromise(cb, payload);
        });
        Q.all(_promises).done(_clearPromises);
      },

      waitFor: function (/*array*/ promiseIndexes, /*function*/ callback) {
        var selectedPromises = _.map(promiseIndexes, function (index) {
          return _promises[index];
        });
        return Q.all(selectedPromises).done(callback);
      }
    };

    return Dispatcher;

  });
