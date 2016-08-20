import Backbone from 'backbone';
import globals from 'globals';

export default Backbone.Model.extend({

    initialize: function (attrs, options) {
      var instance = attrs.instance;
      if (!instance) throw new Error("Missing instance");
      if (!instance.get('provider').uuid) throw new Error("Missing instance.provider.uuid");
      if (!instance.get('identity').uuid) throw new Error("Missing instance.identity.uuid");
      if (!instance.get('uuid')) throw new Error("Missing instance.uuid");
    },

    url: function () {
      var instance = this.get('instance'),
        instanceId = instance.get('uuid'),
        providerId = instance.get('provider').uuid,
        identityId = instance.get('identity').uuid;

      return (
        globals.API_ROOT +
        "/provider/" + providerId +
        "/identity/" + identityId +
        "/instance/" + instanceId +
        "/action"
      )
    }
});
