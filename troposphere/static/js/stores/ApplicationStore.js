define(function (require) {

  var ApplicationCollection = require('collections/ApplicationCollection'),
      ApplicationSearchResultCollection = require('collections/ApplicationSearchResultCollection'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Application = require('models/Application'),
      BaseStore = require('stores/BaseStore'),
      ApplicationConstants = require('constants/ApplicationConstants'),
      NotificationController = require('controllers/NotificationController');

  var _searchResults = {},
      _isFetchingMore = false,
      _isSearching = false;

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

    searchFor: function(query) {
      if (!_isSearching) {
        _isSearching = true;
        var searchResults = new ApplicationSearchResultCollection(null, {
          query: query
        });

        searchResults.fetch({
          success: function () {
            _isSearching = false;
            _searchResults[query] = searchResults;
            this.emitChange();
          }.bind(this),
          error: function (coll, response) {
            NotificationController.error(response.responseText);
          }.bind(this)
        });
      }
    },

    fetchMoreSearchResultsFor: function (query) {
      var searchResults = _searchResults[query],
          nextUrl = searchResults.meta.next;

      if(nextUrl && !_isFetchingMore){
        _isFetchingMore = true;
        var moreImages = new ApplicationCollection();
        moreImages.fetch({
          url: nextUrl
        }).done(function(){
          _isFetchingMore = false;
          searchResults.add(moreImages.models);
          searchResults.meta = moreImages.meta;
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
      var image = BaseStore.prototype.get.apply(this, arguments);
      if(!image) return this.fetchModel(imageId);
      return image;
    },

    getMoreImages: function(){
      this.fetchMoreImages();
    },

    getSearchResultsFor: function(query){
      if(!query) return this.getAll();

      var searchResults = _searchResults[query];
      if(!searchResults) this.searchFor(query);
      return searchResults;
    },

    getMoreSearchResultsFor: function(query){
      if(!query) throw new Error("query must be specified");
      this.fetchMoreSearchResultsFor(query);
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
