define(
  [
    'underscore',
    'backbone'
  ], function(_, Backbone) {

  var CHANGE_EVENT = 'change';

  var Store = {
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

  return Store;

});
