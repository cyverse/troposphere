define(function (require) {

  var BaseStore = require('stores/BaseStore'),
    StatusCollection = require('collections/StatusCollection');

  var StatusStore = BaseStore.extend({
    collection: StatusCollection
  });

  var store = new StatusStore();

  return store;

});
