define(function (require) {

  var ApplicationVersionCollection = require('collections/ApplicationVersionCollection'),
    Dispatcher = require('dispatchers/Dispatcher'),
    BaseStore = require('stores/BaseStore'),
    ApplicationVersionConstants = require('constants/ApplicationVersionConstants'),
    NotificationController = require('controllers/NotificationController');

  var ApplicationVersionStore = BaseStore.extend({
    collection: ApplicationVersionCollection,

    get: function (imageVersionId) {
      if (!this.models) return this.fetchModels();
      var image_version = BaseStore.prototype.get.apply(this, arguments);
      if (!image_version) return this.fetchModel(imageVersionId);
      return image_version;
    },
    //getForImage: function(image) {
    //  if(!this.models) {
    //      this.fetchModels();
    //  }  else {
    //      return this.models.filter(function(version) {
    //          return version.image.id == image.id;
    //      });
    //  }
    //}
  });

  var store = new ApplicationVersionStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
      case ApplicationVersionConstants.APPLICATION_VERSION_UPDATE:
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
