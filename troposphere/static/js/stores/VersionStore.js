define(function (require) {

  var $ = require('jquery'),
      _ = require('underscore'),
      Store = require('stores/Store'),
      ClientVersion = require('models/ClientVersion'),
      ServerDeployVersion = require('models/ServerDeployVersion'),
      ServerVersion = require('models/ServerVersion');

  var _version;
  var _isFetching = false;

  //
  // CRUD Operations
  //

  var fetchVersions = function () {
    if (!_isFetching) {
      _isFetching = true;
      var clientVersion = new ClientVersion();
      var serverDeployVersion = new ServerDeployVersion();
      var serverVersion = new ServerVersion();

      $.when(clientVersion.fetch(), serverVersion.fetch(), serverDeployVersion.fetch())
        .done(function(client, server){
        _isFetching = false;
        _version = {
          client: clientVersion,
          deploy: serverDeployVersion,
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

  _.extend(VersionStore, Store);

  return VersionStore;

});
