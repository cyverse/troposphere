define(
  [
    'jquery',
    'react',
    'components/SplashScreen.react'
  ],
  function ($, React, SplashScreen) {

    return {
      run: function () {

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
