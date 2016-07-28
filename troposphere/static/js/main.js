import bootstrapper from "bootstrapper";
import "css/app/app.scss";
import Raven from 'raven-js';

let sentryDSN = 'https://27643f06676048be96ad6df686c17da3@app.getsentry.com/73366';

Raven.config(sentryDSN, {release: '4c5346b3d2aee6f3ff025421032f8a0fec817a28'}).install();

bootstrapper.run();
