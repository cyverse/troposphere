define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      Utils = require('../Utils');

  return {

    poll: function(params){
      var instance = params.instance;
      if(!instance) throw new Error("Missing instance");
      Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
    }

  };

});
