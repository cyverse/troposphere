define(function (require) {

  var Backbone = require('backbone'),
      _ = require('underscore'),
      globals = require('globals');

  return Backbone.Model.extend({

    initialize: function(attrs, options){
      if(!attrs.instance) throw new Error("Missing instance");
      if(!attrs.instance.get('provider').id) throw new Error("Missing instance.provider.id");
      if(!attrs.instance.get('identity').id) throw new Error("Missing instance.identity.id");
      if(!attrs.instance.id) throw new Error("Missing instance.id");
    },

    url: function(){
      var instance = this.get('instance'),
          providerId = instance.get('provider').id,
          identityId = instance.get('identity').id;

      return (
        globals.API_ROOT +
        "/provider/" + providerId +
        "/identity/" + identityId +
        "/instance/" + instance.id +
        "/action"
      )
    }

  });

});
