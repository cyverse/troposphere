define(
  [
    'dispatchers/dispatcher',
    'underscore'
  ],
  function (Dispatcher, _) {

    var AppDispatcher = {
      handleRouteAction: function (action) {
        Dispatcher.dispatch({
          source: 'ROUTE_ACTION',
          action: action
        });
      }
    };

    _.extend(AppDispatcher, Dispatcher);

    return AppDispatcher;
  });
