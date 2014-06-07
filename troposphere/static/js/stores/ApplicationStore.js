define(
  [
    'underscore',
    'collections/applications',
    'collections/application_search_results',
    'dispatchers/Dispatcher',
    'rsvp',
    'models/application',
    'actions/ApplicationActions',
    'stores/Store'
  ], function(_, ApplicationCollection, SearchResults, Dispatcher, RSVP, Application, ApplicationActions, Store) {

  var _applications = new ApplicationCollection();
  var _search_results = {};
  var _synced = false;

  var Applications = {
    fetchAll: function() {
      return new RSVP.Promise(function (resolve, reject) {
        var apps = new ApplicationCollection();
        apps.fetch().done(function() {
          resolve(apps);
        });
      });
    },
    fetchDetail: function(appId) {
      return new RSVP.Promise(function (resolve, reject) {
        var application = new Application({id: appId});
        application.fetch().done(function () {
          resolve(application);
        });
      });
    },
    search: function(query) {
      var apps = new SearchResults([], {
        query: query
      });

      return new RSVP.Promise(function (resolve, reject) {
        apps.fetch({
          success: function (coll) {
            resolve(coll);
          },
          error: function (coll, response) {
            reject(response.responseText);
          }
        });
      });
    }
  };

  var ApplicationStore = {
    isSynced: function() {
      return _synced;
    },
    get: function(appId) {
      return _applications.get(appId);
    },
    getAll: function() {
      return _applications;
    },
    getFeatured: function() {
      return new ApplicationCollection(_applications.filter(function(app) {
        return app.get('featured');
      }));
    },
    fetchAll: function() {
      Applications.fetchAll().then(function(coll) {
        _applications = coll;
        _synced = true;
        this.emitChange();
      }.bind(this));
    },
    fetchDetail: function(appId) {
      Applications.fetchDetail(appId).then(function(model) {
        _applications.add(model);
        this.emitChange();
      }.bind(this));
    },
    getResults: function(query) {
      return _search_results[query];
    },
    search: function(query) {
      Applications.search(query).then(function(collection) {
        _search_results[query] = collection;
        this.emitChange();
      }.bind(this));
    }
  };

  Dispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
      case ApplicationActions.constants.fetchAll:
        ApplicationStore.fetchAll();
        break;
      case ApplicationActions.constants.fetchDetail:
        ApplicationStore.fetchDetail(action.id);
        break;
      case ApplicationActions.constants.search:
        ApplicationStore.search(action.query);
        break;
      default:
        return true;
    }

    return true;
  });

  _.extend(ApplicationStore, Store);

  return ApplicationStore;
});
