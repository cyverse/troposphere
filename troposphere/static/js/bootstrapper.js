define(
  [
    'jquery',
    'react',
    'components/SplashScreen.react'
  ],
  function ($, React, SplashScreen) {

    return {
      run: function () {

        // todo: remove in production - development mode only
        if (window.location.hostname == 'localhost') {
          window.access_token = "api-token";
        }

        $.ajaxSetup({
          headers: {
            "Authorization": "Token " + window.access_token,
            "Content-Type": "application/json"
          }
        });

        $(document).ready(function () {
          React.renderComponent(SplashScreen(), document.getElementById('application'));
        });
      }
    }

  });
