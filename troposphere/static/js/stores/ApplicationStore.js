define(function (require) {

  var _ = require('underscore'),
      ApplicationCollection = require('collections/ApplicationCollection'),
      ApplicationSearchResultCollection = require('collections/ApplicationSearchResultCollection'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Application = require('models/Application'),
      Store = require('stores/Store'),
      ApplicationConstants = require('constants/ApplicationConstants'),
      NotificationController = require('controllers/NotificationController'),
      context = require('context');

  var _applications = null,
      _featuredImages = null,
      _userImages = null,
      _searchResults = {},
      _isFetching = false,
      _isFetchingImage = {},
      _isFetchingFeaturedImages = false,
      _isFetchingUserImages = false,
      _isFetchingMore = false,
      _isSearching = false;

  var fetchApplications = function () {
    if(!_isFetching) {
      _isFetching = true;
      var applications = new ApplicationCollection();
      applications.fetch().done(function () {
        _isFetching = false;
        _applications = applications;
        ApplicationStore.emitChange();
      });
    }
  };

  var fetchApplication = function(imageId){
    if(!_isFetchingImage[imageId]){
      _isFetchingImage[imageId] = true;
      var image = new Application({ id: imageId });
      image.fetch().done(function () {
        _isFetchingImage[imageId] = false;
        _applications.add(image);
        ApplicationStore.emitChange();
      });
    }
  };

  var fetchFeaturedImages = function(){
    if(!_isFetchingFeaturedImages) {
      _isFetchingFeaturedImages = true;
      var images = new ApplicationCollection();
      var url = images.url + "?tags__name=Featured";
      images.fetch({url: url}).done(function () {
        _isFetchingFeaturedImages = false;
        _featuredImages = images;
        ApplicationStore.emitChange();
      });
    }
  };

  var fetchUserImages = function () {
    if(!_isFetchingUserImages) {
      _isFetchingUserImages = true;
      var images = new ApplicationCollection();
      images.fetch({
        url: images.url + "?created_by__username=" + context.profile.get('username')
      }).done(function () {
        _isFetchingUserImages = false;
        _userImages = images;
        ApplicationStore.emitChange();
      });
    }
  };

  var fetchMoreImages = function () {
    var nextUrl = _applications.meta.next;
    if(nextUrl && !_isFetchingMore){
      _isFetchingMore = true;
      var moreImages = new ApplicationCollection();
      moreImages.fetch({url: nextUrl}).done(function () {
        _isFetchingMore = false;
        _applications.add(moreImages.models);
        _applications.meta = moreImages.meta;
        ApplicationStore.emitChange();
      });
    }
  };

  var fetchMoreSearchResultsFor = function (query) {
    var searchResults = _searchResults[query],
        nextUrl = searchResults.meta.next;

    if(nextUrl && !_isFetchingMore){
      _isFetchingMore = true;
      var moreImages = new ApplicationCollection();
      moreImages.fetch({url: nextUrl}).done(function () {
        _isFetchingMore = false;
        searchResults.add(moreImages.models);
        searchResults.meta = moreImages.meta;
        ApplicationStore.emitChange();
      });
    }
  };

  function update(application){
    application.save({
      name: application.get('name'),
      description: application.get('description'),
      tags: application.get('tags')
    }, {
      patch: true
    }).done(function(){
      ApplicationStore.emitChange();
    }).fail(function(){
      var failureMessage = "Error updating Application " + application.get('name') + ".";
      NotificationController.error(failureMessage);
      ApplicationStore.emitChange();
    });
  }

  function searchFor(query) {
    if (!_isSearching) {
      _isSearching = true;
      var searchResults = new ApplicationSearchResultCollection(null, {
        query: query
      });

      searchResults.fetch({
        success: function () {
          _isSearching = false;
          _searchResults[query] = searchResults;
          ApplicationStore.emitChange();
        },
        error: function (coll, response) {
          NotificationController.error(response.responseText);
        }
      });
    }
  }

  var ApplicationStore = {

    get: function (appId) {
      if(!_applications) {
        return fetchApplications();
      }

      var image = _applications.get(appId);
      if(!image) {
        return fetchApplication(appId);
      }

      return image;
    },

    getAll: function () {
      if(!_applications) {
        fetchApplications();
      } else {
        return _applications;
      }
    },

    getAllFeatured: function(){
      if(!_featuredImages) {
        fetchFeaturedImages();
      } else {
        return _featuredImages;
      }
    },

    getMoreImages: function(){
      fetchMoreImages();
    },

    getFeatured: function () {
      if(!_applications) {
        fetchApplications();
      } else {
        var featuredApplications = _applications.filter(function (app) {
          return app.get('featured');
        });
        return new ApplicationCollection(featuredApplications);
      }
    },

    getFavorited: function(){
      if (!_applications) {
        fetchApplications();
      } else {
        return new ApplicationCollection(_applications.where({isFavorited: true}));
      }
    },

    getUserImages: function(){
      if (!_userImages) {
        fetchUserImages();
      } else {
        return _userImages;
      }
    },

    getSearchResultsFor: function(query){
      if(!query) return this.getAll();

      var searchResults = _searchResults[query];
      if(!searchResults){
        searchFor(query);
      }
      return searchResults;
    },

    getMoreSearchResultsFor: function(query){
      if(!query) throw new Error("query must be specified");
      fetchMoreSearchResultsFor(query);
    }

  };

  Dispatcher.register(function (payload) {
    var action = payload.action;

    switch (action.actionType) {
      case ApplicationConstants.APPLICATION_UPDATE:
        update(action.application);
        break;

      default:
        return true;
    }

    ApplicationStore.emitChange();

    return true;
  });

  _.extend(ApplicationStore, Store);

  return ApplicationStore;
});
