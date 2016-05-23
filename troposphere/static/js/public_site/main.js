import bootstrapper from 'public_site/bootstrapper.react';
import Raven from 'raven-js';

let sentryDSN = 'https://27643f06676048be96ad6df686c17da3@app.getsentry.com/73366';

Raven.config(sentryDSN, {release: '6a34f86c188811e698eb0242ac130001'}).install();

bootstrapper.run();
