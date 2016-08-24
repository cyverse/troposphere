import jstz from "jstz";


let timezone = jstz.determine();
let tz_region = timezone ? timezone.name() : "America/Phoenix";
let shell_proxy = "https://atmo-proxy.iplantcollaborative.org/";

export default {
    API_ROOT: window.API_ROOT || "/api/v1",
    API_V2_ROOT: window.API_V2_ROOT || "/api/v2",
    API_V2_MOCK_ROOT: window.API_V2_MOCK_ROOT,
    TROPO_API_ROOT: window.TROPO_API_ROOT || "/tropo-api",
    WEB_SH_URL: window.WEB_SH_URL || shell_proxy,
    THEME_URL: window.THEME_URL || "",
    STATUS_PAGE_LINK: window.STATUS_PAGE_LINK || "",
    SITE_TITLE: window.SITE_TITLE || "Atmosphere",
    SITE_FOOTER: window.SITE_FOOTER || "CyVerse",
    UI_VERSION: window.UI_VERSION || "Unknown Unicolored-Jay",
    SUPPORT_EMAIL: window.SUPPORT_EMAIL || "support@iplantcollaborative.org",
    TZ_REGION: tz_region,
    BADGE_HOST: window.BADGE_HOST,
    BADGE_IMAGE_HOST: window.BADGE_IMAGE_HOST,
    BADGE_ASSERTION_HOST: window.BADGE_ASSERTION_HOST,
    BADGES_ENABLED: window.BADGES_ENABLED || false,
    USE_MOCK_DATA: window.USE_MOCK_DATA || false,
    USE_ALLOCATION_SOURCES: window.USE_ALLOCATION_SOURCES
}
