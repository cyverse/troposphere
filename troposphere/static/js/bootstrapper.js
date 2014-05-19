define(
  [
    'jquery',
    'react',
    'components/Root.react',
    'rsvp',
    'models/session',
    'marionette'
  ],
  function ($, React, Application, RSVP, Session, Marionette) {

    return {
      run: function () {
        // Catch-all for errors within promises
        RSVP.on('error', function (reason) {
          console.assert(false, reason);
        });

        var session = new Session();

        // todo: remove in production - development mode only
        window.access_token = "fake-token";
        window.expires = "it's a mystery!";

        if (window.access_token) {
          $.ajaxSetup({
            headers: {'Authorization': 'Bearer ' + window.access_token}
          });
          session.set({
            access_token: window.access_token,
            expires: window.expires
          });
        }

        $(document).ready(function () {
          var app = Application({session: session});
          React.renderComponent(app, document.getElementById('application'));
        });
      }
    }

  });