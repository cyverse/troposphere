define(function (require) {

  var ImageVersionCollection = require('collections/ImageVersionCollection'),
      Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BaseStore'),
      ImageVersionConstants = require('constants/ImageVersionConstants'),
      NotificationController = require('controllers/NotificationController');

  var ImageVersionStore = BaseStore.extend({
    collection: ImageVersionCollection,

    get: function (imageVersionId) {
      if(!this.models) return this.fetchModels();
      var image_version = BaseStore.prototype.get.apply(this, arguments);
      if(!image_version) return this.fetchModel(imageVersionId);
      return image_version;
    },
  });

  var store = new ImageVersionStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
      case ImageVersionConstants.IMAGE_VERSION_UPDATE:
        store.update(payload);
        break;

      default:
        return true;
    }

    store.emitChange();

    return true;
  });

  return store;
});
