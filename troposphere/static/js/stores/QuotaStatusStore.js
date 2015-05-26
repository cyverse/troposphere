define(function (require) {

  var BaseStore = require('stores/BaseStore'),
      QuotaStatusCollection = require('collections/QuotaStatusCollection');

  var QuotaStatusStore = BaseStore.extend({

    collection: QuotaStatusCollection,

    getStatusWithName: function(text) {
      if(!this.models) return this.fetchModels();
      return this.models.findWhere({name: text});
    }

  });

  var store = new QuotaStatusStore();

  return store;

});
