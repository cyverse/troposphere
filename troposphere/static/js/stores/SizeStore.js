define(function (require) {

  var BaseStore = require('stores/BaseStore'),
      SizeCollection = require('collections/SizeCollection');

  var _modelsFor = {};
  var _isFetchingFor = {};

  var SizeStore = BaseStore.extend({
    collection: SizeCollection,

    // todo: the only thing different between this and the base class is the page_size query param
    fetchModels: function(){
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
