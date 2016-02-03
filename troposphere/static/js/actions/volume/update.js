define(function (require) {
  "use strict";

  var VolumeConstants = require('constants/VolumeConstants'),
    Utils = require('../Utils');

  return {

    update: function (volume, newAttributes) {
      if (!volume) throw new Error("Missing volume");
      if (!newAttributes || !newAttributes.name) throw new Error("Missing attributes.name");

      volume.set(newAttributes);

      Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});

      volume.save({
        name: volume.get('name')
      }, {
        patch: true,
        merge: true
      }).done(function () {
        // Nothing to do here
      }).fail(function (response) {
        Utils.displayError({title: "Volume could not be updated", response: response});
      }).always(function () {
        Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
        Utils.dispatch(VolumeConstants.POLL_VOLUME, {volume: volume});
      });
    }

  };

});
