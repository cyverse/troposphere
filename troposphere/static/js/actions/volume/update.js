define(function (require) {

  var VolumeConstants = require('constants/VolumeConstants'),
      Utils = require('../Utils');

  return {

    update: function (volume, newAttributes) {
      volume.set(newAttributes);
      Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});

      volume.save({
        name: volume.get('name')
      },{
        patch: true
      }).done(function(){
        Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
      }).fail(function(response){
        Utils.displayError({title: "Volume could not be updated", response: response});
        Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
      });
    }

  };

});
