define(function (require) {

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Store = require('stores/Store'),
      Collection = require('collections/ImageBookmarkCollection'),
      Constants = require('constants/ImageBookmarkConstants'),
      ImageCollection = require('collections/ApplicationCollection'),
      stores = require('stores');

  var _models = null;
  var _isFetching = false;

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

    get: function (modelId) {
      if(!_models) {
        fetchModels();
      } else {
        return _models.get(modelId);
      }
    },

    getAll: function () {
      if(!_models) {
        return fetchModels();
      }
      return _models;
    },

    getImageBookmarkFor: function(image){
      if(!_models) return fetchModels();

      return _models.find(function(ib){
        return ib.get('image').id === image.id;
      });
    },

    getBookmarkedImages: function(){
      if(!_models) return fetchModels();
      var haveAllImages = true;

      var images = _models.map(function(ib){
        var image = stores.ApplicationStore.get(ib.get('image').id);
        if(!image) haveAllImages = false;
        return image;
      });

      if(!haveAllImages) return null;

      return new ImageCollection(images);
    }

  };

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case Constants.ADD_IMAGE_BOOKMARK:
        add(payload.imageBookmark);
        break;

      case Constants.REMOVE_IMAGE_BOOKMARK:
        remove(payload.imageBookmark);
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
