define(function (require) {

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Store = require('stores/Store'),
      Collection = require('collections/InstanceTagCollection'),
      Constants = require('constants/InstanceTagConstants'),
      TagCollection = require('collections/TagCollection'),
      Tag = require('models/Tag');

  var _models = new Collection();
  var _isFetching = false;

  var _modelsFor = {};
  var _isFetchingFor = {};

  //
  // CRUD Operations
  //

  var fetchModels = function () {
    if(!_models && !_isFetching) {
      _isFetching = true;
      var models = new Collection();
      models.fetch().done(function () {
        _isFetching = false;
        _models = models;
        ModelStore.emitChange();
      });
    }
  };

  var fetchModelsFor = function(instanceId){
    if(!_modelsFor[instanceId] && !_isFetchingFor[instanceId]) {
      _isFetchingFor[instanceId] = true;
      var models = new Collection();
      models.fetch({
        url: models.url + "?instance__id=" + instanceId
      }).done(function () {
        _isFetchingFor[instanceId] = false;

        // add models to existing cache
        _models.add(models.models);

        // convert InstanceTag collection to a TagCollection
        var tags = models.map(function(it){
          return new Tag(it.get('tag'), {parse: true});
        });
        tags = new TagCollection(tags);

        _modelsFor[instanceId] = tags;
        ModelStore.emitChange();
      });
    }
  };

  function add(model){
    _models.add(model);
  }

  function remove(model){
    _models.remove(model);
  }


  //
  // Model Store
  //

  var ModelStore = {

    get: function (projectInstanceId) {
      if(!_models) {
        fetchModels();
      } else {
        return _models.get(projectInstanceId);
      }
    },

    getAll: function () {
      if(!_models) {
        fetchModels()
      }
      return _models;
    },

    getInstanceTagFor: function(instance, tag){
      return _models.find(function(it){
        return it.get('instance').id === instance.id && it.get('tag').id === tag.id;
      });
    },

    getTagsFor: function(instance){
      if(!_modelsFor[instance.id]) return fetchModelsFor(instance.id);

      // convert InstanceTag collection to an TagCollection
      var instanceTags = _models.filter(function(it){
        return it.get('instance').id === instance.id;
      });

      var tags = instanceTags.map(function(it){
        return new Tag(it.get('tag'), {parse: true});
      });
      return new TagCollection(tags);
    }

  };

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case Constants.ADD_INSTANCE_TAG:
        add(payload.instanceTag);
        break;

      case Constants.REMOVE_INSTANCE_TAG:
        remove(payload.instanceTag);
        break;

      case Constants.EMIT_CHANGE:
        break;

      default:
        return true;
    }

    if(!options.silent) {
      ModelStore.emitChange();
    }

    return true;
  });

  _.extend(ModelStore, Store);

  return ModelStore;
});
