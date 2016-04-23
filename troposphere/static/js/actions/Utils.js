define(function (require) {
  'use strict';

  var AppDispatcher = require('dispatchers/AppDispatcher'),
    NotificationController = require('controllers/NotificationController'),
    $ = require('jquery');

  return {

    dispatch: function (actionType, payload, options) {
      options = options || {};
      AppDispatcher.handleRouteAction({
        actionType: actionType,
        payload: payload,
        options: options
      });
    },

    displayInfo: function (options) {
      if (!options.message) throw new Error("Missing message");
      NotificationController.info(null, options.message);
    },

    // Size information for the user's browser and monitor
    browserContext: function() {
      return {
          "window-width": $(window).width(),
          "window-height": $(window).height(),
          "screen-width": screen.width,
          "screen-height": screen.height,
          "user-interface": "troposphere"
      };

    },

    displaySuccess: function (options) {
      if (!options.message) throw new Error("Missing message");
      NotificationController.success(null, options.message);
    },

    displayError: function (options) {
      var response = options.response,
        title = options.title;

      try {
        var error,
            error_json = response.responseJSON;
        if ( 'errors' in error_json ) {
            error = error_json.errors[0];
        } else {
            error = {'code': response.status, 'message': "Encountered the following errors:" +JSON.stringify(error_json)};
        }
        NotificationController.error(
          title,
          error.code + ": " + error.message
        );
      }
      catch (err) {
        NotificationController.error(
          title,
          "If the problem persists, please contact support."
        );
      }
    }

  };

});
