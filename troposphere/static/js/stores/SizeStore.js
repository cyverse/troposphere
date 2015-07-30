define(function (require) {

  var BaseStore = require('stores/BaseStore'),
    SizeCollection = require('collections/SizeCollection');

  var SizeStore = BaseStore.extend({
    collection: SizeCollection,

    queryParams: {
      page_size: 100
    }
  });

  var store = new SizeStore();

  return store;

});
