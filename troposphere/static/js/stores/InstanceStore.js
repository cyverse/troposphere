define(
  [
    'underscore',
    'dispatchers/dispatcher',
    'stores/store',
    'rsvp',
    'collections/instances',
    'constants/InstanceConstants',
    'controllers/notifications'
  ],
  function (_, Dispatcher, Store, RSVP, InstanceCollection, InstanceConstants, NotificationController) {

    var _instances = null;
    var _isFetching = false;

    //
    // CRUD Operations
    //

    var fetchInstances = function () {
      _isFetching = true;
      var promise = new RSVP.Promise(function (resolve, reject) {
        var instances = new InstanceCollection();
        instances.fetch().done(function () {
          _isFetching = false;
          _instances = instances;
          resolve();
        });
      });
      return promise;
    };

    //
    // Instance Store
    //

    var InstanceStore = {

      getAll: function () {
        if(!_instances) {
          fetchInstances().then(function(){
            InstanceStore.emitChange();
          }.bind(this));
        }
        return _instances;
      }

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        //case ProjectConstants.PROJECT_CREATE:
        //  create(action.model);
        //  break;

        default:
          return true;
      }

      InstanceStore.emitChange();

      return true;
    });

    _.extend(InstanceStore, Store);

    return InstanceStore;
  });
