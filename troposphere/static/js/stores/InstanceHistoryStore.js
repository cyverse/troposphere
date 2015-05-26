define(function(require){

  var BaseStore = require('stores/BaseStore'),
      InstanceHistoryCollection = require('collections/InstanceHistoryCollection');

  var InstanceHistoryStore = BaseStore.extend({
    collection: InstanceHistoryCollection,

    queryParams: {
      page: 1
    }
  });

  var store = new InstanceHistoryStore();

  return store;
});
