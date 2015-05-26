define(function (require) {

  var MaintenanceMessageCollection = require('collections/MaintenanceMessageCollection'),
      BaseStore = require('stores/BaseStore');

  var MaintenanceMessageStore = BaseStore.extend({

    isProviderInMaintenance: function(providerId){
      var providerMessages = this.models.where({provider: providerId}),
          isInMaintenance = false;

      providerMessages.forEach(function(message){
        if(message.get('disable_login') === true) {
          isInMaintenance = true;
        }
      });

      return isInMaintenance;
    }

  });

  return new MaintenanceMessageStore(null, {
    collection: MaintenanceMessageCollection
  });

});
