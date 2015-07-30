define(function (require) {

  var MaintenanceMessageCollection = require('collections/MaintenanceMessageCollection'),
    BaseStore = require('stores/BaseStore');

  var MaintenanceMessageStore = BaseStore.extend({
    collection: MaintenanceMessageCollection,

    isProviderInMaintenance: function (providerId) {
      var providerMessages = this.models.where({provider: providerId}),
        isInMaintenance = false;

      providerMessages.forEach(function (message) {
        if (message.get('disable_login') === true) {
          isInMaintenance = true;
        }
      });

      return isInMaintenance;
    }

  });

  var store = new MaintenanceMessageStore();

  return store;

});
