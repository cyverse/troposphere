define(function (require) {

  var BaseStore = require('stores/BaseStore'),
      ProviderCollection = require('collections/ProviderCollection');

  var ProviderStore = new BaseStore(null, {
    collection: ProviderCollection
  });

  return ProviderStore;

});
