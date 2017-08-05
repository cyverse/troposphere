import Raven from "raven-js";

/**
 * Send _message_ out to logging/context capture service
 *
 * @param {string} message short description of occurrence
 * @param {object} data any extra context to associate
 *
 * This is _not_ capture an exception nor system fault. This
 * is meant to capture context of a noteworthy occurrence.
 *
 * Additional data can be passed as the second parameter to
 * `captureMessage` and will be merged with any global
 * context set on the raven client.
 *
 * There are some 'keyword' properties, like `level`. The
 * example below is provided in the Sentry docs:
 * ```
 *   Raven.captureMessage('Something happened', {
 *     level: 'info' // one of 'info', 'warning', or 'error'
 *   });
 * ```
 *
 * Though, you can pass keys in and they will be merged with
 * the existing context.
 *
 * (Note: believe the global context will overwrite data
 * passed in. You can verify this in the raven-js source,
 * look for `objectMerge()`)
 *
 * ```
 *   Raven.captureMessage('Something happened', {
 *     instance: '<uuid>',
 *     troposphere_context: 'page-view'
 *   });
 * ```
 */
const captureMessage = (message, data) => {
    // only call if we have a configuration client available
    if (Raven && Raven.isSetup()) {
        Raven.captureMessage(message, {
            extra: data
        });
    }
}

export { captureMessage };
