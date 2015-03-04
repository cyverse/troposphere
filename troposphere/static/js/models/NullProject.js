define(function (require) {

  var Backbone = require('backbone');

  return Backbone.Model.extend({

    initialize: function(attrs){
      this.set('instances', attrs.instances || []);
      this.set('volumes', attrs.volumes || []);
    },

    isEmpty: function () {
      var instances = this.get('instances').filter(function(instance){
        return instance.get('projects').length === 0;
      });

      var volumes = this.get('volumes').filter(function(volume){
        return volume.get('projects').length === 0;
      });

      return instances.length === 0 && volumes.length === 0;
    }

  });

});
