define(
  [
    'underscore',
    'stores/Store',
    'collections/SizeCollection',
    'dispatchers/AppDispatcher'
  ],
  function (_, Store, SizeCollection, AppDispatcher) {

    var _sizes = null;
    var _isFetching = false;

    var fetchSizes = function () {
      if(!_isFetching) {
        _isFetching = true;
        var sizes = new SizeCollection();
        sizes.fetch().done(function () {
          _isFetching = false;
          _sizes = sizes;
          SizeStore.emitChange();
        });
      }
    };

    var SizeStore = {

      getAll: function () {
        if(!_sizes) {
          fetchSizes();
        } else {
          return _sizes;
        }
      },

      get: function (sizeId) {
        if(!_sizes) {
          fetchSizes();
        }
        return _sizes.get(sizeId);
      },

      getAllFor: function (providerId, identityId) {
        var providerSizes;
        if(!_sizes) {
          fetchSizes();
        } else {
          providerSizes = _sizes.where(function(size){
            return size.get('provider').id === providerId;
          });
          return new SizeCollection(providerSizes);
        }
      }

    };

    AppDispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        default:
          return true;
      }

      SizeStore.emitChange();

      return true;
    });

    _.extend(SizeStore, Store);

    return SizeStore;

  });
