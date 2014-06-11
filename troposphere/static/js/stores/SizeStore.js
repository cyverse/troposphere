define(
  [
    'underscore',
    'stores/Store',
    'rsvp',
    'collections/SizeCollection',
    'dispatchers/AppDispatcher',
    'actions/SizeActions'
  ],
  function (_, Store, RSVP, SizeCollection, AppDispatcher, SizeActions) {

    var _sizes = {};

    var _getSizesUncached = function (providerId, identityId) {
      return new RSVP.Promise(function (resolve, reject) {
        var sizes = new SizeCollection([], {
          provider_id: providerId,
          identity_id: identityId
        });
        sizes.on('sync', resolve);
        sizes.fetch();
      });
    };

    var SizeStore = {

      get: function (providerId, identityId) {
        var provider = _sizes[providerId];
        if (provider)
          return provider[identityId];
      },

      fetch: function (providerId, identityId) {
        _getSizesUncached(providerId, identityId)
          .then(function (collection) {
            if (!_sizes[providerId])
              _sizes[providerId] = {};
            _sizes[providerId][identityId] = collection;
            this.emitChange();
          }.bind(this))
      }
    };

    AppDispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        case SizeActions.constants.fetch:
          SizeStore.fetch(action.providerId, action.identityId);
          break;
      }

      return true;
    });

    _.extend(SizeStore, Store);

    return SizeStore;

  });
