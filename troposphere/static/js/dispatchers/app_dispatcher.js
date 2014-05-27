define(['dispatchers/dispatcher', 'underscore'], function(Dispatcher, _) {

  var AppDispatcher = _.extend(Dispatcher, {
    handleRouteAction: function(action) {
      Dispatcher.dispatch({
        source: 'ROUTE_ACTION',
        action: action
      });
    }
  });

  return AppDispatcher;
});
