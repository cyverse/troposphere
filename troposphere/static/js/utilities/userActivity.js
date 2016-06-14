
/**
 * Sends an event to Intercom to record a action done by a user
 *
 * Disabling this function is possible by setting `intercom_app_id` to `null`.
 *
 * "Events are information on what a user did and when they did it" [1].
 *
 * Advice on `actionName`:
 *
 * "We also recommmend sending event names that combine a past tense verb and
 *  nouns, such as 'created-project'." [1]
 *
 * So a good event name is the combination of _'past_tense_verb-noun' to
 * provide readability:
 * - 'reported-volume'
 * - 'sent-feedback'
 * - 'launched-instance'
 * - 'rebooted-instance'
 *
 *
 * @param {string} actionName - name of the event performed, should be a
 *  combination of past tense verb and noun
 * @param {object} details - any information associated with the event; this
 *  can be simple objects, strings, numbers, dates, links [2]
 *
 * [1] https://developers.intercom.io/reference#events
 * [2] https://developers.intercom.io/reference#event-metadata-types
 */
const trackAction = (actionName, details) => {
    try {
        if (window.intercom_app_id && window.Intercom) {
            window.Intercom('trackEvent', actionName, details);
        }
    } catch (e) {
        // optionally - can call out to Raven
        // ... this operation is not a critical path, so swallowing the error
        //     for now is not as objectionable as it normally would be
    }
}

export { trackAction };
