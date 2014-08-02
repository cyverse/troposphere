define(
  [
    'backbone',
    'globals',
    'models/Instance'
  ],
  function (Backbone, globals, Instance) {

    return Backbone.Collection.extend({
      model: Instance,

      url: function () {
        var url = globals.API_ROOT + "/project/" + this.project.id + "/instance" + globals.slash();
        return url;
      },

      initialize: function(models, options){
        this.project = options.project;
      }
    });

  });
