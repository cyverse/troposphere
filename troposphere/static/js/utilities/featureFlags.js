
export default {
    WEB_DESKTOP: !!window.WEB_DESKTOP_INCLUDE_LINK || false,
    hasIntercomActive() {
        return window.intercom_app_id && window.Intercom;
    }
}
