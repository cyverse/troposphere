define(['rsvp', 'underscore'], function(RSVP, _) {

  var _callbacks = [];
  var _promises = [];

  var _addPromise = function(cb, payload) {
    _promises.push(new RSVP.Promise(function(resolve, reject) {
      if (cb(payload))
        resolve(payload);
      else
        reject(new Error("Dispatcher callback unsuccessful"));
    }));
  };

  var _clearPromises = function() {
    _promises = [];
  };

  var Dispatcher = {
    register: function(cb) {
      _callbacks.push(cb);
      return _callbacks.length - 1;
    },
    dispatch: function(payload) {
      _.each(_callbacks, function(cb) {
        _addPromise(cb, payload);
      });
      RSVP.all(_promises).then(_clearPromises);
    },
    waitFor: function(/*array*/ promiseIndexes, /*function*/ callback) {
      var selectedPromises = _.map(promiseIndexes, function(index) {
        return _promises[index];
      });
      return RSVP.all(selectedPromises).then(callback);
    }
  };

  return Dispatcher;

});
