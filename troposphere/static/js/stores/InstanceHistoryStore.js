define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'collections/InstanceHistoryCollection',
    'controllers/NotificationController'
  ],
  function (_, Dispatcher, Store, InstanceHistoryCollection, NotificationController) {

    var _instanceHistories = null;
    var _isFetching = false;
    var _isFetchingMore = false;

    //
    // CRUD Operations
    //

    var fetchInstanceHistory = function () {
      if(!_isFetching) {
        _isFetching = true;

        var instances = new InstanceHistoryCollection();
        var baseUrl = instances.url() + "?page=1";
        instances.fetch({url: baseUrl}).done(function () {
          _isFetching = false;
          _instanceHistories = instances;
          InstanceHistoryStore.emitChange();
        });
      }
    };

    var fetchMoreInstanceHistory = function () {
      var nextUrl = _instanceHistories.meta.next;
      if(nextUrl && !_isFetchingMore){
        _isFetchingMore = true;
        var moreHistory = new InstanceHistoryCollection();
        var nextUrl = moreHistory.url() + nextUrl;
        moreHistory.fetch({url: nextUrl}).done(function () {
          _isFetchingMore = false;
          _instanceHistories.add(moreHistory.models);
          _instanceHistories.meta = moreHistory.meta;
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
      },

      fetchMore: function(){
        fetchMoreInstanceHistory();
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
