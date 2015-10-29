import AppDispatcher from 'dispatchers/AppDispatcher';
import Utils from './Utils';
import NotificationController from 'controllers/NotificationController';

// Constants
import ImageVersionConstants from 'constants/ImageVersionConstants';

// Models
import ImageVersion from 'models/ImageVersion';

// Modals
import ModalHelpers from 'components/modals/ModalHelpers';

export default {

    update: function(version, newAttributes) {
      if(!version) throw new Error("Missing Image Version");
      if(!newAttributes) throw new Error("No attributes to be updated");

      version.set(newAttributes);
      //TODO:
      version.save(newAttributes, {
        patch:true,
      }).done(function(){
        // UPDATE_VERSION here if we do NOT want 'optimistic updating'
        // Othewise, do nothing..
      }).fail(function(err_resp){
        var error_json = err_resp.responseJSON;
        if (error_json.hasOwnProperty('non_field_errors')) {
            err_message = error_json.non_field_errors.join(" , ");
        } else {
            err_message = error_json;
        }
        var message = "Error updating Image Version " + version.get('name') + ": "+ err_message;
        NotificationController.error(null, message);
        Utils.dispatch(ImageVersionConstants.REMOVE_IMAGE_VERSION, {version: version});
      }).always(function(){
        // todo: add a POLL_IMAGE_VERSION constant if you want this to work (also need
        // to add a handler in the ImageVersionStore)
        //Utils.dispatch(ImageVersionConstants.POLL_IMAGE_VERSION, {version: version});
      });
    },


  }
