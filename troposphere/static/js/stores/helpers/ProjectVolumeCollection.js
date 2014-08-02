define(
  [
    'backbone',
    'globals',
    'models/Volume'
  ],
  function (Backbone, globals, Volume) {

    return Backbone.Collection.extend({
      model: Volume,

      url: function () {
        var url = globals.API_ROOT + "/project/" + this.project.id + "/volume" + globals.slash();
        return url;
      },

      initialize: function(models, options){
        this.project = options.project;
      }
    });

  });
