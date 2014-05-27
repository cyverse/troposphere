define(
  [
    'backbone',
    'models/application',
    'globals'
  ],
  function (Backbone, Application, globals) {

    return Backbone.Collection.extend({
      model: Application,

      url: function () {
        return globals.API_ROOT + "/application" + globals.slash();
      }

    });

  });
