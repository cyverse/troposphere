
import  $ from 'jquery';
import  _ from 'underscore';
import  Store from 'stores/Store';
import  ClientVersion from 'models/ClientVersion';
import  ServerDeployVersion from 'models/ServerDeployVersion';
import  ServerVersion from 'models/ServerVersion';

let _version;
let _isFetching = false;

//
// CRUD Operations
//

let fetchVersions = function() {
    if (!_isFetching) {
        _isFetching = true;
        var clientVersion = new ClientVersion();
        var serverDeployVersion = new ServerDeployVersion();
        var serverVersion = new ServerVersion();

        $.when(clientVersion.fetch(), serverVersion.fetch(), serverDeployVersion.fetch())
            .done(function(client, server) {
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

let VersionStore = {
    getVersion: function() {
        if (!_version) {
            fetchVersions()
        }
        return _version;
    }
};

_.extend(VersionStore, Store);

export default VersionStore;
