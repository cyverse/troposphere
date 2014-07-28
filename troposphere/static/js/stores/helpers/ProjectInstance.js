define(
  [
    'backbone',
    'globals'
  ],
  function (Backbone, globals) {

    return Backbone.Model.extend({

      urlRoot: function() {
        return globals.API_ROOT + "/project/" + this.project.id + "/instance";
      },

      url: function () {
        var url = Backbone.Model.prototype.url.apply(this) + globals.slash();
        return url;
      },

      initialize: function(options){
        this.instance = options.instance;
        this.project = options.project;
        this.set("id", this.instance.id);
      }
    });

  });
