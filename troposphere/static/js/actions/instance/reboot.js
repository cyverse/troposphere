
import InstanceConstants from 'constants/InstanceConstants';
import InstanceState from 'models/InstanceState';
import Utils from '../Utils';
import InstanceActionRequest from 'models/InstanceActionRequest';

export default {

    reboot: function (params) {
      if(!params.instance) throw new Error("Missing instance");
      if(!params.reboot_type) throw new Error("Missing reboot Type (soft/hard)");

      // If user desires a hard reboot, need to pass an additional argument of reboot_type
      // action: "reboot"
      // reboot_type: "HARD"

      var instance = params.instance,
        instanceState = new InstanceState({status_raw: "active - rebooting", status: "active", activity: "rebooting"}),
        originalState = instance.get('state'),
        actionRequest = new InstanceActionRequest({instance: instance});

      instance.set({state: instanceState});
      Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

      actionRequest.save(null, {
          attrs: {action: "reboot", reboot_type: params.reboot_type}
      }).done(function(){
        instance.set({
          state: instanceState
        });
      }).fail(function (response) {
        instance.set({state: originalState});
        Utils.displayError({title: "Your instance could not be resumed", response: response});
      }).always(function () {
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
      });
    }

  };
