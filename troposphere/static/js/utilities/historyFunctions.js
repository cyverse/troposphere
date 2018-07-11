import {browserHistory} from "react-router";

import useBasename from "history/lib/useBasename";

/**
 * Helper functions for simplifying the use of the `history` module
 */

const withBasename = (history, base) => {
    return useBasename(() => history)({basename: `/${base}`});
};

const withAppBasename = history => {
    // might want to pull the second argument, "application" from the
    // "render context" provided in `globals` to allow for
    // configuration transparency, and the ability to "re-root" the app
    // to another _base_ URL using `basename`
    return withBasename(history, "application");
};

function browserHistoryWithBase() {
    return withAppBasename(browserHistory);
}

/**
 * Expose the history as an object/singleton to mirror the react-router
 * `browserHistory` object.
 *
 * We are merely providing a 'preconfigured' version of `browserHistory`
 * with the application basename applied so it will be prepended to
 * routes as we navigate.
 */
const appBrowserHistory = browserHistoryWithBase();

export {withBasename, withAppBasename, appBrowserHistory};
