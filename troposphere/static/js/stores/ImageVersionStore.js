import ImageVersionCollection from 'collections/ImageVersionCollection';
import Dispatcher from 'dispatchers/Dispatcher';
import stores from 'stores';
import BaseStore from 'stores/BaseStore';
import ImageVersionConstants from 'constants/ImageVersionConstants';

let ImageVersionStore = BaseStore.extend({
    collection: ImageVersionCollection,

    get: function(imageVersionId) {
        if (!this.models) return this.fetchModels();
        var image_version = BaseStore.prototype.get.apply(this, arguments);
        if (!image_version) return this.fetchModel(imageVersionId);
        return image_version;
    },

    getScripts: function(versionId) {
        var _scripts = stores.ScriptStore.fetchWhere({
            version_id: versionId
        });

        if (_scripts == null) {
            return null;
        }

        return _scripts;
    },
    getMachines: function(versionId) {
        var _machines = stores.ProviderMachineStore ?
            stores.ProviderMachineStore.fetchWhere(
                {version_id: versionId}
            ) : null;

        if (_machines == null) {
            return null;
        }
        //MOVE AWAY from backbone!
        return _machines.toJSON();
    }
});

let store = new ImageVersionStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case ImageVersionConstants.IMAGE_VERSION_UPDATE:
            store.update(payload);
            break;

        default:
            return true;
    }

    store.emitChange();

    return true;
});

export default store;
