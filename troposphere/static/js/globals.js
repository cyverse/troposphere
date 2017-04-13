import jstz from "jstz";


let timezone = jstz.determine();
let tz_region = timezone ? timezone.name() : "America/Phoenix";
let shell_proxy = "https://atmo-proxy.cyverse.org/";
let default_footer_link = "http://www.cyverse.org/";

let USER_PORTAL = {
    link() {
        return window.user_portal && window.user_portal.link || "";
    },
    text() {
        return window.user_portal && window.user_portal.text || "";
    }
};


export default {
    API_ROOT: window.API_ROOT || "/api/v1",
    API_V2_ROOT: window.API_V2_ROOT || "/api/v2",
    API_V2_MOCK_ROOT: window.API_V2_MOCK_ROOT,
    TROPO_API_ROOT: window.TROPO_API_ROOT || "/tropo-api",
    WEB_SH_URL: window.WEB_SH_URL || shell_proxy,
    THEME_URL: window.THEME_URL || "",
    STATUS_PAGE_LINK: window.STATUS_PAGE_LINK || "",
    SITE_TITLE: window.SITE_TITLE || "Atmosphere",
    SITE_FOOTER_HTML: window.SITE_FOOTER_HTML || "",
    SITE_FOOTER: window.SITE_FOOTER || "CyVerse",
    SITE_FOOTER_LINK: window.SITE_FOOTER_LINK || default_footer_link,
    UI_VERSION: window.UI_VERSION || "Unknown Unicolored-Jay",
    SUPPORT_EMAIL: window.SUPPORT_EMAIL || "support@iplantcollaborative.org",
    TZ_REGION: tz_region,
    BADGE_HOST: window.BADGE_HOST,
    BADGES_ENABLED: window.BADGES_ENABLED || false,
    USE_MOCK_DATA: window.USE_MOCK_DATA || false,
    USE_ALLOCATION_SOURCES: window.USE_ALLOCATION_SOURCES,
    EXTERNAL_ALLOCATION: window.EXTERNAL_ALLOCATION,
    ALLOCATION_UNIT_ABBREV: window.ALLOCATION_UNIT_ABBREV,
    ALLOCATION_UNIT_NAME: window.ALLOCATION_UNIT_NAME,
    SHOW_INSTANCE_METRICS: window.SHOW_INSTANCE_METRICS,
    USER_PORTAL
}
