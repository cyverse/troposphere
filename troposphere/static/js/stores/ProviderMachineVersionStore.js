define(function (require) {

  var Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BaseStore'),
      ProviderMachineVersionCollection = require('collections/ProviderMachineVersionCollection'),
      ProviderMachineVersionConstants = require('constants/ProviderMachineVersionConstants'),
      TagCollection = require('collections/TagCollection'),
      Tag = require('models/Tag');

  var _modelsFor = {};
  var _isFetchingFor = {};

  var ProviderMachineVersionStore = BaseStore.extend({
    collection: ProviderMachineVersionCollection,

    initialize: function(){
      this.models = new ProviderMachineVersionCollection();
    },

    fetchModelsFor: function(instanceId){
      if(!_modelsFor[instanceId] && !_isFetchingFor[instanceId]) {
        _isFetchingFor[instanceId] = true;
        var models = new ProviderMachineVersionCollection();
        models.fetch({
          url: models.url + "?instance__id=" + instanceId
        }).done(function () {
          _isFetchingFor[instanceId] = false;

          // add models to existing cache
          this.models.add(models.models);

          // convert ProviderMachineVersion collection to a TagCollection
          var tags = models.map(function(it){
            return new Tag(it.get('tag'), {parse: true});
          });
          tags = new TagCollection(tags);

          _modelsFor[instanceId] = tags;
          this.emitChange();
        }.bind(this));
      }
    },

    getTagsFor: function(instance){
      if(!_modelsFor[instance.id]) return this.fetchModelsFor(instance.id);

      // convert ProviderMachineVersion collection to an TagCollection
      var providerMachineVersions = this.models.filter(function(it){
        return it.get('instance').id === instance.id;
      });

      var tags = providerMachineVersions.map(function(it){
        return new Tag(it.get('tag'), {parse: true});
      });
      return new TagCollection(tags);
    }

  });

  var store = new ProviderMachineVersionStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case ProviderMachineVersionConstants.ADD_INSTANCE_TAG:
        store.add(payload);
        break;

      case ProviderMachineVersionConstants.REMOVE_INSTANCE_TAG:
        store.remove(payload);
        break;

      case ProviderMachineVersionConstants.EMIT_CHANGE:
        break;

      default:
        return true;
    }

    if(!options.silent) {
      store.emitChange();
    }

    return true;
  });

  return store;
});
