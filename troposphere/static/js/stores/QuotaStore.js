define(function (require) {

  var BaseStore = require('stores/BaseStore'),
      QuotaCollection = require('collections/QuotaCollection');

  var QuotaStore = BaseStore.extend({
    collection: QuotaCollection,

    fetchModels: function () {
      if (!this.models && !this.isFetching) {
        this.isFetching = true;
        var models = new this.collection();
        models.fetch({
          url: models.url + "?page_size=100"
        }).done(function(){
          this.isFetching = false;
          this.models = models;
          this.emitChange();
        }.bind(this));
      }
    }

  });

  var store = new QuotaStore();

  return store;
});
