//import context from "context";

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

const hasProjectSharing = () => {
    //FIXME: include ability to use context to determine if user is staff
    //       - uncomment `import` statement
    //let is_staff = context.profile.get('is_staff');

    return window.PROJECT_SHARING || false;
};

const showClientCredentials = () => {
    //TODO: Provide a way for this to be enabled in a future feature.
    return false;
};

const showIdentityView = () => {
    //TODO: Provide a way for this to be enabled in a future feature.
    return false;
};

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
    WEB_DESKTOP: !!window.WEB_DESKTOP_ENABLED || false,
    hasIntercomActive,
    showIdentityView,
    shouldReportInstanceViaIntercom,
    shouldReportVolumeViaIntercom,
    GUACAMOLE: !!window.GUACAMOLE_ENABLED || false,
    hasProjectSharing,
    showClientCredentials
}
