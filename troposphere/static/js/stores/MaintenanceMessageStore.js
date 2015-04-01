define(
  [
    'underscore',
    'collections/MaintenanceMessageCollection',
    'dispatchers/Dispatcher',
    'stores/Store'
  ],
  function (_, MaintenanceMessageCollection, Dispatcher, Store) {

    var _messages = null;
    var _isFetching = false;

    var fetchMessages = function () {
      if(!_isFetching) {
        _isFetching = true;
        var messages = new MaintenanceMessageCollection();
        messages.fetch().done(function () {
          _isFetching = false;
          _messages = messages;
          MaintenanceMessageStore.emitChange();
        });
      }
    };

    var MaintenanceMessageStore = {

      getAll: function () {
        if(!_messages) {
          fetchMessages();
        } else {
          return _messages;
        }
      },

      isProviderInMaintenance: function(providerId){
        var providerMessages = _messages.where({provider: providerId}),
            isInMaintenance = false;

        providerMessages.forEach(function(message){
          if(message.get('disable_login') === true) {
            isInMaintenance = true;
          }
        });

        return isInMaintenance;
      }

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {

        default:
           return true;
      }

      MaintenanceMessageStore.emitChange();

      return true;
    });

    _.extend(MaintenanceMessageStore, Store);

    return MaintenanceMessageStore;
  });
