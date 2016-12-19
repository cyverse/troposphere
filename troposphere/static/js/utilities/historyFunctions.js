import useBasename from 'history/lib/useBasename';

/**
 * Helper functions for simplifying the use of the `history` module
 */

const withBasename = (history, base) => {
    return useBasename(() => history)({basename: `/${base}`});
}

const withAppBasename = (history) => {
    // might want to pull this from the "render context" provided
    // in `globals` to allow for configuration transparency
    return withBasename(history, "application");
}

export { withBasename, withAppBasename };
