
import InstanceConstants from 'constants/InstanceConstants';
import InstanceState from 'models/InstanceState';
import Utils from '../Utils';
import InstanceActionRequest from 'models/InstanceActionRequest';

export default {

    redeploy: function (params) {
      if(!params.instance) throw new Error("Missing instance");

      var instance = params.instance,
          instanceState = new InstanceState({status_raw: "active - initializing"}),
          originalState = instance.get('state'),
          actionRequest = new InstanceActionRequest({instance: instance});

      instance.set({state: instanceState});
      Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

      actionRequest.save(null, {
        attrs: {action: "redeploy"}
      }).done(function(){
        instance.set({
          state: new InstanceState({status_raw: "active - initializing"})
        });
      }).fail(function(response){
        instance.set({state: originalState});
        Utils.displayError({title: "The call to start instance redeployment has failed.", response: response});
      }).always(function(){
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
      });
    }

  };
