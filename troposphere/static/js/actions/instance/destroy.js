define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      InstanceState = require('models/InstanceState'),
      stores = require('stores'),
      Utils = require('../Utils'),
      ProjectInstanceConstants = require('constants/ProjectInstanceConstants'),
      globals = require('globals');

  return {

    destroy: function(payload, options){
      if(!payload.project) throw new Error("Missing project");
      if(!payload.instance) throw new Error("Missing instance");

      var instance = payload.instance,
          project = payload.project,
          instanceState = new InstanceState({status_raw: "deleting"}),
          originalState = instance.get('state'),
          identity = instance.get('identity'),
          provider = instance.get('provider'),
          url = (
            globals.API_ROOT +
            "/provider/" + provider.uuid +
            "/identity/" + identity.uuid +
            "/instance/"   + instance.get('uuid')
          );

      instance.set({state: instanceState});
      Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

      instance.destroy({
        url: url
      }).done(function () {
        var projectInstance = stores.ProjectInstanceStore.getProjectInstanceFor(project, instance);
        // todo: the proper thing to do is to poll until the instance is actually destroyed
        // and THEN remove it from the project. Need to find a way to support that.
        Utils.dispatch(InstanceConstants.REMOVE_INSTANCE, {instance: instance});
        Utils.dispatch(ProjectInstanceConstants.REMOVE_PROJECT_INSTANCE, {projectInstance: projectInstance}, options);
      }).fail(function (response) {
        instance.set({state: originalState});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
        Utils.displayError({title: "Your instance could not be deleted", response: response});
      });
    }

  };

});
