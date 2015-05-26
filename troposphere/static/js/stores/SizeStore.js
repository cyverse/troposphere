define(function (require) {

  var BaseStore = require('stores/BaseStore'),
      SizeCollection = require('collections/SizeCollection');

  var _modelsFor = {};
  var _isFetchingFor = {};

  var SizeStore = BaseStore.extend({
    collection: SizeCollection,

    queryParams: {
      page_size: 100
    },

    fetchModelsFor: function(providerId){
      if(!_modelsFor[providerId] && !_isFetchingFor[providerId]) {
        _isFetchingFor[providerId] = true;
        var models = new SizeCollection();
        models.fetch({
          url: models.url + "?provider__id=" + providerId + "&page_size=100"
        }).done(function () {
          _isFetchingFor[providerId] = false;
          _modelsFor[providerId] = models;
          this.emitChange();
        }.bind(this));
      }
    },

    getSizesFor: function(provider){
      if(!_modelsFor[provider.id]) return this.fetchModelsFor(provider.id);
      return _modelsFor[provider.id];
    }

  });

  var store = new SizeStore();

  return store;

});
