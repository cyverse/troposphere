
import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import ImageVersionLicenseCollection from 'collections/ImageVersionLicenseCollection';
import ImageVersionLicenseConstants from 'constants/ImageVersionLicenseConstants';
import LicenseCollection from 'collections/LicenseCollection';
import License from 'models/License';

let _modelsFor = {};
let _isFetchingFor = {};

let ImageVersionLicenseStore = BaseStore.extend({
    collection: ImageVersionLicenseCollection,

    initialize: function() {
        this.models = new ImageVersionLicenseCollection();
    },

    fetchModelsFor: function(imageVersionId) {
        if (!_modelsFor[imageVersionId] && !_isFetchingFor[imageVersionId]) {
            _isFetchingFor[imageVersionId] = true;
            var models = new ImageVersionLicenseCollection();
            models.fetch({
                url: models.url + "?version_id=" + imageVersionId
            }).done(function() {
                _isFetchingFor[imageVersionId] = false;

                // add models to existing cache
                this.models.add(models.models);

                // convert ImageVersionLicense collection to a LicenseCollection
                var licenses = models.map(function(version_license) {
                    return new License(version_license.get('license'), {
                        parse: true
                    });
                });
                licenses = new LicenseCollection(licenses);

                _modelsFor[imageVersionId] = licenses;
                this.emitChange();
            }.bind(this));
        }
    },

    getLicensesFor: function(imageversion) {
        if (!_modelsFor[imageversion.id]) return this.fetchModelsFor(imageversion.id);

        // convert ImageVersionLicense collection to an LicenseCollection
        var imageVersionLicenses = this.models.filter(function(version_license) {
            return version_license.get('image_version').id === imageversion.id;
        });

        var licenses = imageVersionLicenses.map(function(version_license) {
            return new License(version_license.get('license'), {
                parse: true
            });
        });
        return new LicenseCollection(licenses);
    }

});

let store = new ImageVersionLicenseStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

        case ImageVersionLicenseConstants.ADD_IMAGEVERSION_LICENSE:
            store.add(payload.image_versionLicense);
            break;

        case ImageVersionLicenseConstants.REMOVE_IMAGEVERSION_LICENSE:
            store.remove(payload.image_versionLicense);
            break;

        case ImageVersionLicenseConstants.EMIT_CHANGE:
            break;

        default:
            return true;
    }

    if (!options.silent) {
        store.emitChange();
    }

    return true;
});

export default store;
