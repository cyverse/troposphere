define(function (require) {
  "use strict";

  var VolumeConstants = require('constants/VolumeConstants'),
    Utils = require('../Utils');

  return {

    poll: function (params) {
      var volume = params.volume;
      if (!volume) throw new Error("Missing volume");
      Utils.dispatch(VolumeConstants.POLL_VOLUME, {volume: volume});
    }

  };

});
