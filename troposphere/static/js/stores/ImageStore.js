define(function (require) {

  var moment = require('moment'),
      ImageCollection = require('collections/ImageCollection'),
      ProviderCollection = require('collections/ProviderCollection'),
      Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BaseStore'),
      stores = require('stores'),
      ImageConstants = require('constants/ImageConstants'),
      NotificationController = require('controllers/NotificationController');

  var ImageStore = BaseStore.extend({
    collection: ImageCollection,

    update: function(image){
      var tags = image.get('tags')
      var tagIds = tags.map(function(tag){
          return tag.id;
      });
      var updateAttrs = {
        name: image.get('name'),
        description: image.get('description'),
        tags: tagIds
      }
      if(image.get('end_date')) {
        var end_date;
        if (typeof image.get('end_date') == "object") {
            end_date = image.get('end_date')
        } else {
            //NOTE: This may never happen..
            end_date = moment(image.get('end_date'));
        }
        //Test validity if the date
        if(end_date.isValid()) {
            end_date = end_date.toISOString();
        } else {
            end_date = null;
        }
        //Add new date (or non-date) to the update list
        updateAttrs.end_date = end_date
      }
      image.save(updateAttrs, {
        patch: true
      }).done(function(){
        image.set({tags:tags});
        this.emitChange();
      }.bind(this)).fail(function(){
        var failureMessage = "Error updating Image " + image.get('name') + ".";
        NotificationController.error(failureMessage);
        this.emitChange();
      }.bind(this));
    },

    get: function (imageId) {
      if(!this.models) return this.fetchModels();
      var image = BaseStore.prototype.get.apply(this, arguments);
      if(!image) return this.fetchModel(imageId);
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
        if(!_versions) {
            return null;
        }

        return _versions;
    },
    getMachines: function(imageId) {
        var machines = [],
            partialLoad = false,
            versions = this.getVersions(imageId);
        //Wait for it...
        if(!versions) {
            return null;
        }
        versions.map(function (version) {
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

        machines = machines.filter(function (machine) {
            // remove duplicate machines
            if (!machineHash[machine.id]) {
                machineHash[machine.id] = machine;
                return true;
            }
        });
        return new ProviderMachineCollection(machines);
    },
    getProviders: function (imageId) {
        /**
         * Using list of versions, collect their machines and filter down the available providers.
         */
        var providerHash = {},
            providers = [],
            partialLoad = false,
            versions = this.getVersions(imageId);
        //Wait for it...
        if(!versions) {
            return null;
        }
        versions.map(function (version) {
            var machines = stores.ImageVersionStore.getMachines(version.id);
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

  var store = new ImageStore();

  Dispatcher.register(function (dispatch) {
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

  return store;
});
