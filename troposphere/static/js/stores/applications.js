define(
  [
    'underscore',
    'collections/applications',
    'dispatchers/dispatcher',
    'rsvp',
    'models/application',
    'actions/applications',
    'stores/store'
  ], function(_, ApplicationCollection, Dispatcher, RSVP, Application, AppActions, Store) {

  var _applications = new ApplicationCollection();
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
      return new Applications(_applications.filter(function(app) {
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
    }
  };

  Dispatcher.register(function(payload) {
    var action = payload.action;
    console.log(payload);

    switch(action.actionType) {
      case AppActions.constants.fetchAll:
        ApplicationStore.fetchAll();
        break;
      case AppActions.constants.fetchDetail:
        ApplicationStore.fetchDetail(action.id);
        break;
      default:
        return true;
    }

    return true;
  });

  _.extend(ApplicationStore, Store);

  return ApplicationStore;
});
