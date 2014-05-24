define(['dispatchers/dispatcher'], function(Dispatcher) {

  // TODO: Move this
  var handleRouteAction = function(action) {
    Dispatcher.dispatch({
      source: 'ROUTE_ACTION',
      action: action
    });
  };

  var ApplicationActions = {
    fetch: function(appId) {
      handleRouteAction({
        actionType: 'application_fetchdetail',
        id: appId
      });
    },
    fetchAll: function() {
      handleRouteAction({
        actionType: 'application_fetchall'
      });
    }
  };

  return ApplicationActions;
});
