import "babel-polyfill";
import bootstrapper from "bootstrapper";
import "css/app/app.scss";
import Raven from "raven-js";

let sentryDSN = "https://27643f06676048be96ad6df686c17da3@app.getsentry.com/73366";

Raven.config(sentryDSN, {
    release: "0985ad55a5dc118e6da249494e59c173c3770bb3"
}).install();

bootstrapper.run();
