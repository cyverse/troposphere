define(function (require) {

    var _ = require('underscore'),
        Backbone = require('backbone'),
        globals = require('globals'),
        stores = require('stores'),
        ApplicationVersionCollection = require('../collections/ApplicationVersionCollection'),
        ProviderCollection = require('../collections/ProviderCollection'),
        ProviderMachineCollection = require('../collections/ProviderMachineCollection'),
        moment = require('moment');

    return Backbone.Model.extend({

        urlRoot: globals.API_V2_ROOT + "/images",

        parse: function (attributes) {
            // todo: move this feature into ImageBookmarksStore
            attributes.isFavorited = true; //response.is_bookmarked;
            attributes.start_date = moment(attributes.start_date);
            attributes.end_date = moment(attributes.end_date);
            attributes.description = attributes.description || "";

            return attributes;
        },

        toJSON: function (options) {
            var attributes = _.clone(this.attributes);
            attributes.is_bookmarked = attributes.isFavorited;
            delete attributes['isFavorited'];
            return attributes;
        },
        getVersions: function() {
            /**
             * Returns the list of versions *OR* null && Starts the 'fetch' process.
             */
            var _versions = stores.ApplicationVersionStore.fetchWhere({
                application__id: this.id
            });
            //TODO: _versions is returning an OBJECT instead of an array?!?!
            if(!_versions) {
                return null;
            }

            return _versions;
        },
        getMachines: function() {
            var machineHash = {},
                machines = [],
                partialLoad = false,
                versions = this.getVersions();
            //Wait for it...
            if(!versions) {
                return null;
            }
            versions.map(function (version) {
                var _machines = version.getMachines();
                if (!_machines) {
                    partialLoad = true;
                    return;
                }
                machines = machines.concat(_machines.models);
            });

            //Don't try to render until you are 100% ready
            if (partialLoad) {
                return null;
            }
            //TODO: Why??
            machines = machines.filter(function (machine) {
                // remove duplicate machines
                if (!machineHash[machine.id]) {
                    machineHash[machine.id] = machine;
                    return true;
                }
            });
            return new ProviderMachineCollection(machines);
        },
        getProviders: function () {
            /**
             * Using list of versions, collect their machines and filter down the available providers.
             */
            var providerHash = {},
                providers = [],
                partialLoad = false,
                versions = this.getVersions();
            //Wait for it...
            if(!versions) {
                return null;
            }
            versions.map(function (version) {
                var machines = version.getMachines();
                if (!machines) {
                    partialLoad = true;
                    return;
                }

                var _providers = machines.filter(
                    function (machine) {
                        // filter out providers that don't exist
                        var providerId = machine.provider.id,
                            provider = stores.ProviderStore.get(machine.provider.id);

                        if (!provider) console.warn("Machine " + machine.id + " listed on version " + version.id + " showing availability on non-existent provider " + providerId);

                        return provider;
                    });

                if (_providers) {
                    providers = providers.concat(_providers);
                }
            });
            //Don't try to render until you are 100% ready
            if (partialLoad) {
                return null;
            }
            providers = new ProviderCollection(providers).filter(function (provider) {
                // remove duplicate providers
                if (!providerHash[provider.id]) {
                    providerHash[provider.id] = provider;
                    return true;
                }
            });
            return providers;
        }


    });

});
