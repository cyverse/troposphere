import "babel-polyfill";
import bootstrapper from "public_site/bootstrapper";
import "css/app/app.scss";
import Raven from "raven-js";


if(window.SENTRY_ENABLED) {
    let sentryDSN = window.SENTRY_DSN;
    Raven.config(sentryDSN, {
        release: window.SENTRY_RELEASE
    }).install();
}

bootstrapper.run();
