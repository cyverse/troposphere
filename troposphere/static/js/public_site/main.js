import bootstrapper from 'public_site/bootstrapper.react';
import Raven from 'raven-js';

let sentryDSN = 'https://27643f06676048be96ad6df686c17da3@app.getsentry.com/73366';

Raven.config(sentryDSN, {release: 'dfdfd4c7765c8aa5e2e4e34ac3baea92431ca511'}).install();

bootstrapper.run();
