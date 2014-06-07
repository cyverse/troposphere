define(
  [
    'backbone',
    'models/Provider',
    'globals'
  ],
  function (Backbone, Provider, globals) {

    return Backbone.Collection.extend({
      model: Provider,

      url: function () {
        return globals.API_ROOT + "/provider" + globals.slash();
      }

    });

  });
