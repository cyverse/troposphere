define(
  [
    'jquery',
    'underscore',
    'stores/Store',
    'collections/IdentityCollection',
    'dispatchers/AppDispatcher',
    'constants/IdentityConstants',
    'rsvp',
    'models/ClientVersion',
    'models/ServerVersion'
  ],
  function ($, _, Store, IdentityCollection, AppDispatcher, IdentityConstants, RSVP, ClientVersion, ServerVersion) {

    var _version = {};
    var _isFetching = false;

    //
    // CRUD Operations
    //

    var fetchVersions = function () {
      if (!_isFetching) {
        _isFetching = true;
        var clientVersion = new ClientVersion();
        var serverVersion = new ServerVersion();

        $.when({
          client: clientVersion.fetch(),
          server: serverVersion.fetch()
        }).done(function(version){
          _isFetching = false;
          _version = version;
          VersionStore.emitChange();
        })
      }
    };

    //
    // Version Store
    //

    var VersionStore = {
      getAll: function () {
        if (!_version) {
          fetchVersions()
        }
        return _version;
      }
    };

    AppDispatcher.register(function (payload) {
      var action = payload.action;
      switch (action.actionType) {
        //case VersionConstants.ACTION:
        //  VersionStore.action();
        //  break;
      }

      return true;
    });

    _.extend(VersionStore, Store);

    return VersionStore;

  });
