define(function (require) {

  var ApplicationCollection = require('collections/ApplicationCollection'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Application = require('models/Application'),
      BaseStore = require('stores/BaseStore'),
      ApplicationConstants = require('constants/ApplicationConstants'),
      NotificationController = require('controllers/NotificationController');

  var _isFetchingMore = false;

  var ApplicationStore = BaseStore.extend({
    collection: ApplicationCollection,

    fetchMoreImages: function () {
      var nextUrl = this.models.meta.next;
      if(nextUrl && !_isFetchingMore){
        _isFetchingMore = true;
        var moreImages = new ApplicationCollection();
        moreImages.fetch({
          url: nextUrl
        }).done(function () {
          _isFetchingMore = false;
          this.models.add(moreImages.models);
          this.models.meta = moreImages.meta;
          this.emitChange();
        }.bind(this));
      }
    },

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
    },

    getMoreImages: function(){
      this.fetchMoreImages();
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
