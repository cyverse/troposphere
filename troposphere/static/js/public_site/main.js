import bootstrapper from 'public_site/bootstrapper.react';
import Raven from 'raven-js';

let sentryDSN = 'https://27643f06676048be96ad6df686c17da3@app.getsentry.com/73366';

Raven.config(sentryDSN, {release: '22854c9be9aad248d509dd0a5b9af38fef0cd856'}).install();

bootstrapper.run();
