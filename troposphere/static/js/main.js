import bootstrapper from "bootstrapper";
import "css/app/app.scss";
import Raven from 'raven-js';

let sentryDSN = 'https://27643f06676048be96ad6df686c17da3@app.getsentry.com/73366';

Raven.config(sentryDSN, {release: '0ddd55c31d67e06b4462e19f3f38e1d0852cdbf3'}).install();

bootstrapper.run();
