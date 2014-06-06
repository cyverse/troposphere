define(['dispatchers/app_dispatcher'], function(AppDispatcher) {

  var IdentityActions = {
    constants: {
      fetchAll: 'identity_fetch_all'
    },
    fetchAll: function() {
      AppDispatcher.handleRouteAction({
        actionType: this.constants.fetchAll
      });
    }
  };

  return IdentityActions;
});
