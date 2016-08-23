
import Router from 'react-router';

// router singleton
let _router;

// create the router and assign to the singleton
function createRouter(routes) {
    _router = Router.create({
        routes: routes,
        location: Router.HistoryLocation
    });
}

export default {
    // get or create the router
    getInstance: function(routes) {
        if (!_router) createRouter(routes);
        return _router;
    }
};
