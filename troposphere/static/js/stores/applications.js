define(
  [
    'underscore',
    'backbone',
    'collections/applications',
    'dispatchers/dispatcher',
    'rsvp',
    'models/application'
  ], function(_, Backbone, ApplicationCollection, Dispatcher, RSVP, Application) {

  var CHANGE_EVENT = 'change';

  var _applications = new ApplicationCollection();
  var _synced = false;

  var Applications = {
    fetchAll: function() {
      return new RSVP.Promise(function (resolve, reject) {
        apps = new ApplicationCollection();
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
    },
    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
      this.off(CHANGE_EVENT, callback);
    },
    emitChange: function() {
      this.trigger(CHANGE_EVENT);
    }
  };

  Dispatcher.register(function(payload) {
    var action = payload.action;
    console.log(payload);

    switch(action.actionType) {
      case 'application_fetchall':
        ApplicationStore.fetchAll();
        break;
      case 'application_fetchdetail':
        ApplicationStore.fetchDetail(action.id);
        break;
      default:
        return true;
    }

    return true;
  });

  _.extend(ApplicationStore, Backbone.Events);

  return ApplicationStore;
});
