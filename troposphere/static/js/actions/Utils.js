define(function (require) {
  'use strict';

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      NotificationController = require('controllers/NotificationController');

  return {

    dispatch: function(actionType, payload, options){
      options = options || {};
      AppDispatcher.handleRouteAction({
        actionType: actionType,
        payload: payload,
        options: options
      });
    },

    displaySuccess: function(options){
      if(!options.message) throw new Error("Missing message");
      NotificationController.success(null, options.message);
    },

    displayError: function(options){
      var response = options.response,
          title = options.title;

      try {
        var error = response.responseJSON.errors[0];
        NotificationController.error(
          title,
          error.code + ": " + error.message
        );
      }
      catch(err){
        NotificationController.error(
          title,
          "If the problem persists, please contact support."
        );
      }
    }

  };

});
