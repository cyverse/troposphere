define(function (require) {

  var ApplicationCollection = require('collections/ApplicationCollection'),
      Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BaseStore'),
      ApplicationConstants = require('constants/ApplicationConstants'),
      NotificationController = require('controllers/NotificationController');

  var ApplicationStore = BaseStore.extend({
    collection: ApplicationCollection,

    update(image){
      image.save({
        name: image.get('name'),
        description: image.get('description'),
        tags: image.get('tags')
      }, {
        patch: true
      }).done(function(){
        this.emitChange();
      }.bind(this)).fail(function(){
        var failureMessage = "Error updating Application " + image.get('name') + ".";
        NotificationController.error(failureMessage);
        this.emitChange();
      }.bind(this));
    },

    get: function (imageId) {
      if(!this.models) return this.fetchModels();
      var image = BaseStore.prototype.get.apply(this, arguments);
      if(!image) return this.fetchModel(imageId);
      return image;
    }

  });

  var store = new ApplicationStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
      case ApplicationConstants.APPLICATION_UPDATE:
        store.update(payload.application);
        break;

      default:
        return true;
    }

    store.emitChange();

    return true;
  });

  return store;
});
