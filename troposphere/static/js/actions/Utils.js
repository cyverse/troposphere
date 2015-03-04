define(function (require) {
  'use strict';

  var AppDispatcher = require('dispatchers/AppDispatcher');

  return {

    dispatch: function(actionType, payload, options){
      options = options || {};
      AppDispatcher.handleRouteAction({
        actionType: actionType,
        payload: payload,
        options: options
      });
    }

  };

});
