
import Dispatcher from 'dispatchers/Dispatcher';
import _ from 'underscore';

var AppDispatcher = {
    handleRouteAction: function(action) {
        Dispatcher.dispatch({
            source: 'ROUTE_ACTION',
            action: action
        });
    }
};

_.extend(AppDispatcher, Dispatcher);

export default AppDispatcher;
