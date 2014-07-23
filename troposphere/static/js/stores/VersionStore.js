define(
  [
    'jquery',
    'underscore',
    'stores/Store',
    'collections/IdentityCollection',
    'dispatchers/AppDispatcher',
    'rsvp',
    'models/ClientVersion',
    'models/ServerVersion'
  ],
  function ($, _, Store, IdentityCollection, AppDispatcher, RSVP, ClientVersion, ServerVersion) {

    var _version;
    var _isFetching = false;

    //
    // CRUD Operations
    //

    var fetchVersions = function () {
      if (!_isFetching) {
        _isFetching = true;
        var clientVersion = new ClientVersion();
        var serverVersion = new ServerVersion();

//        $.when({
//          client: clientVersion.fetch(),
//          server: serverVersion.fetch()
//        }).done(function(version){
        $.when(clientVersion.fetch(), serverVersion.fetch())
          .done(function(client, server){
          _isFetching = false;
          _version = {
            client: clientVersion,
            server: serverVersion
          };
          VersionStore.emitChange();
        })
      }
    };

    //
    // Version Store
    //

    var VersionStore = {
      getVersion: function () {
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
