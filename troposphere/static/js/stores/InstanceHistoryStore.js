define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'collections/InstanceHistoryCollection',
    'controllers/NotificationController',
    'stores/IdentityStore'
  ],
  function (_, Dispatcher, Store, InstanceHistoryCollection, NotificationController, IdentityStore) {

    var _instanceHistories = null;
    var _isFetching = false;

    //
    // CRUD Operations
    //

    var fetchInstanceHistory = function () {
      if(!_isFetching) {
        _isFetching = true;

        var instances = new InstanceHistoryCollection();
        instances.fetch().done(function () {
          _isFetching = false;
          _instanceHistories = instances;
          InstanceHistoryStore.emitChange();
        });
      }
    };

    //
    // Instance Store
    //

    var InstanceHistoryStore = {

      getAll: function () {
        if(!_instanceHistories) {
          fetchInstanceHistory();
        }
        return _instanceHistories;
      }

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        default:
          return true;
      }

      InstanceHistoryStore.emitChange();

      return true;
    });

    _.extend(InstanceHistoryStore, Store);

    return InstanceHistoryStore;
  });
