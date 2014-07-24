define(
  [
    'underscore',
    'stores/Store',
    'rsvp',
    'collections/SizeCollection',
    'dispatchers/AppDispatcher'
  ],
  function (_, Store, RSVP, SizeCollection, AppDispatcher) {

    var _sizes = {};
    var _isFetching = {};

    function fetchSizesForProviderIdentity(providerId, identityId){
      addEntriesForProviderIdentityIfNotExists(providerId, identityId);

      if(!_isFetching[providerId][identityId]) {
        _isFetching[providerId][identityId] = true;
        var sizes = new SizeCollection(null, {
          provider_id: providerId,
          identity_id: identityId
        });

        sizes.fetch().done(function () {
          _isFetching[providerId][identityId] = false;
           _sizes[providerId][identityId] = sizes;
          SizeStore.emitChange();
        });
      }
    }

    function addEntriesForProviderIdentityIfNotExists(providerId, identityId){
      // Add fetching entries, set default state to false
      _isFetching[providerId] = _isFetching[providerId] || {};
      _isFetching[providerId][identityId] = _isFetching[providerId][identityId] || false;

      // Add size entries (only needed for provider level, identity level can be undefined)
      _sizes[providerId] = _sizes[providerId] || {};
    }

    var SizeStore = {

      getAllFor: function (providerId, identityId) {
        addEntriesForProviderIdentityIfNotExists(providerId, identityId);

        if (!_sizes[providerId][identityId]) {
          fetchSizesForProviderIdentity(providerId, identityId);
        }
        return _sizes[providerId][identityId];
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
