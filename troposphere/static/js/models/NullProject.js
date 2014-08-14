define(
  [
    'underscore',
    'backbone',
    'globals'
  ],
  function (_, Backbone, globals) {

    return Backbone.Model.extend({

      urlRoot: globals.API_ROOT + "/project/null",

      url: function () {
        var url = Backbone.Model.prototype.url.apply(this) + globals.slash();
        return url;
      },

      isEmpty: function () {
        var instances = this.get('instances');
        var volumes = this.get('volumes');
        var hasNoInstances = instances.length === 0;
        var hasNoVolumes = volumes.length === 0;

        return hasNoInstances && hasNoVolumes;
      }

    });

  });
