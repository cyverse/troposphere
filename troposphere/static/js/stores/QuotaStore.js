define(function (require) {

  var BaseStore = require('stores/BaseStore'),
    QuotaCollection = require('collections/QuotaCollection');

  var QuotaStore = BaseStore.extend({
    collection: QuotaCollection,

    queryParams: {
      page_size: 100
    }
  });

  var store = new QuotaStore();

  return store;
});
