
import InstanceConstants from 'constants/InstanceConstants';
import InstanceState from 'models/InstanceState';
import stores from 'stores';
import Utils from '../Utils';
import ProjectInstanceConstants from 'constants/ProjectInstanceConstants';
import globals from 'globals';

export default {

    destroy: function (payload, options) {
      if (!payload.project) throw new Error("Missing project");
      if (!payload.instance) throw new Error("Missing instance");

      var instance = payload.instance,
        project = payload.project,
        originalState = instance.get('state'),
        instanceState = new InstanceState({status_raw: originalState.get("status") + " - deleting"}),
        identity = instance.get('identity'),
        provider = instance.get('provider'),
        url = (
          globals.API_ROOT +
          "/provider/" + provider.uuid +
          "/identity/" + identity.uuid +
          "/instance/" + instance.get('uuid')
        );

      instance.set({state: instanceState});
      Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

      instance.destroy({
        url: url
      }).done(function () {
        Utils.dispatch(InstanceConstants.POLL_FOR_DELETED, {instance: instance});
      }).fail(function (response) {
        instance.set({state: originalState});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
        Utils.displayError({title: "Your instance could not be deleted", response: response});
      });
    }

  };
