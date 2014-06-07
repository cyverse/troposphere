define(['dispatchers/app_dispatcher'], function(AppDispatcher) {

  var ProviderActions = {
    constants: {
      fetchAll: 'provider_fetch_all'
    },
    fetchAll: function() {
      AppDispatcher.handleRouteAction({
        actionType: this.constants.fetchAll
      });
    }
  };

  return ProviderActions;
});
