
import ImageCollection from 'collections/ImageCollection';
import ProviderCollection from 'collections/ProviderCollection';
import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import stores from 'stores';
import ImageConstants from 'constants/ImageConstants';
import NotificationController from 'controllers/NotificationController';

var ImageStore = BaseStore.extend({
    collection: ImageCollection,

    update: function(image) {
        var tags = image.get('tags')
        var tagIds = tags.map(function(tag) {
            return tag.id;
        });
        image.save({
            name: image.get('name'),
            description: image.get('description'),
            tags: tagIds
        }, {
            patch: true
        }).done(function() {
            image.set({
                tags: tags
            });
            this.emitChange();
        }.bind(this)).fail(function() {
            var failureMessage = "Error updating Image " + image.get('name') + ".";
            NotificationController.error(failureMessage);
            this.emitChange();
        }.bind(this));
    },

    get: function(imageId) {
        if (!this.models) return this.fetchModels();
        var image = BaseStore.prototype.get.apply(this, arguments);
        if (!image) return this.fetchModel(imageId);
        return image;
    },
    getVersions: function(imageId) {
        /**
         * Returns the list of versions *OR* null && Starts the 'fetch' process.
         */
        var _versions = stores.ImageVersionStore.fetchWhere({
            image_id: imageId
        });
        //TODO: _versions is returning an OBJECT instead of an array?!?!
        if (!_versions) {
            return null;
        }

        return _versions;
    },
    getMachines: function(imageId) {
        var machines = [],
            partialLoad = false,
            versions = this.getVersions(imageId);
        //Wait for it...
        if (!versions) {
            return null;
        }
        versions.map(function(version) {
            var _machines = stores.ImageVersionStore.getMachines(version.id);
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
        var machineHash = {};

        machines = machines.filter(function(machine) {
            // remove duplicate machines
            if (!machineHash[machine.id]) {
                machineHash[machine.id] = machine;
                return true;
            }
        });
        return new ProviderMachineCollection(machines);
    },
    getProviders: function(imageId) {
        /**
         * Using list of versions, collect their machines and filter down the available providers.
         */
        var providerHash = {},
            providers = [],
            partialLoad = false,
            versions = this.getVersions(imageId);
        //Wait for it...
        if (!versions) {
            return null;
        }
        versions.map(function(version) {
            var machines = stores.ImageVersionStore.getMachines(version.id);
            if (!machines) {
                partialLoad = true;
                return;
            }

            var _providers = machines.filter(
                function(machine) {
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
        providers = new ProviderCollection(providers).filter(function(provider) {
            // remove duplicate providers
            if (!providerHash[provider.id]) {
                providerHash[provider.id] = provider;
                return true;
            }
        });
        return providers;
    }

});

let store = new ImageStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case ImageConstants.IMAGE_UPDATE:
            store.update(payload.image);
            break;

        default:
            return true;
    }

    store.emitChange();

    return true;
});


export default store;
