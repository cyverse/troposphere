define(function (require) {

  var ImageVersionCollection = require('collections/ImageVersionCollection'),
      Dispatcher = require('dispatchers/Dispatcher'),
      stores = require('stores'),
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

    getScripts: function(versionId) {
        var _scripts = stores.ScriptStore.fetchWhere(
            {version_id: versionId}
        );

        if(_scripts == null) {
            return null;
        }

        return _scripts;
    },
    getMachines: function(versionId) {
        var _machines = stores.ProviderMachineStore.fetchWhere(
            {version_id: versionId}
        );

        if(_machines == null) {
            return null;
        }
        //MOVE AWAY from backbone!
        return _machines.toJSON();
    }
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
        break;
    }

    store.emitChange();

    return true;
  });

  return store;
});
