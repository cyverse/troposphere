define(function (require) {

  var VolumeConstants = require('constants/VolumeConstants'),
      NotificationController = require('controllers/NotificationController'),
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
        //NotificationController.success(null, "Volume name updated");
        Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
      }).fail(function(response){
        var title = "Error updating Volume " + volume.get('name');
        if(response && response.responseJSON && response.responseJSON.errors){
            var errors = response.responseJSON.errors;
            var error = errors[0];
            NotificationController.error(title, error.message);
         }else{
            NotificationController.error(title, "If the problem persists, please let support at support@iplantcollaborative.org.");
         }
      });
    }

  };

});
