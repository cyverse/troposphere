
let reportInstancesViaIntercom = false;
let reportVolumesViaIntercom = false;

/**
 * Take care in extracting the values from the _render context_
 * provided by `templates/index.html` globals.
 *
 * Why?
 * Because `intercom_options` maybe undefined, and the options
 * within it could be defined incorrectly.
 */
if(window.intercom_options && window.intercom_options['report']) {
    let reportOptions = window.intercom_options['report'] || {};
    reportInstancesViaIntercom = reportOptions['instances'] || false;
    reportVolumesViaIntercom = reportOptions['volumes'] || false;
}

const hasIntercomActive = () => {
        return window.intercom_app_id && window.Intercom;
};

const shouldReportInstanceViaIntercom = () => {
    return hasIntercomActive() && reportInstancesViaIntercom;
};

const shouldReportVolumeViaIntercom = () => {
    return hasIntercomActive() && reportVolumesViaIntercom;
};

export default {
    WEB_DESKTOP: !!window.WEB_DESKTOP_INCLUDE_LINK || false,
    hasIntercomActive,
    shouldReportInstanceViaIntercom,
    shouldReportVolumeViaIntercom,
    GUACAMOLE: !!window.GUACAMOLE_ENABLED || false
}
