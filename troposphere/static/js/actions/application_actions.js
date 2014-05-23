define(['dispatcher/dispatcher'], function(Dispatcher) {

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
                actionType: ApplicationConstants.APP_FETCH,
                id: appId
            });
        },
        fetchAll: function() {
            handleRouteAction({
                actionType: ApplicationConstants.APP_FETCH_ALL
            });
        }
    };

    return ApplicationActions;
});
