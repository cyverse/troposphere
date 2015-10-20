
import MaintenanceMessageCollection from 'collections/MaintenanceMessageCollection';
import BaseStore from 'stores/BaseStore';

let MaintenanceMessageStore = BaseStore.extend({
    collection: MaintenanceMessageCollection,

    isProviderInMaintenance: function(providerId) {
        var providerMessages = this.models.where({
                provider: providerId
            }),
            isInMaintenance = false;

        providerMessages.forEach(function(message) {
            if (message.get('disable_login') === true) {
                isInMaintenance = true;
            }
        });

        return isInMaintenance;
    }

});

let store = new MaintenanceMessageStore();

export default store;
