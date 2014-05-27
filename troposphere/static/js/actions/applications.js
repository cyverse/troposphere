define(['dispatchers/app_dispatcher'], function(AppDispatcher) {

  var ApplicationActions = {
    fetch: function(appId) {
      AppDispatcher.handleRouteAction({
        actionType: 'application_fetchdetail',
        id: appId
      });
    },
    fetchAll: function() {
      AppDispatcher.handleRouteAction({
        actionType: 'application_fetchall'
      });
    }
  };

  return ApplicationActions;
});
