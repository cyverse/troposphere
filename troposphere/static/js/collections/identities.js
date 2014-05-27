define(
  [
    'backbone',
    'models/identity',
    'globals'
  ],
  function (Backbone, Identity, globals) {

    return Backbone.Collection.extend({
      model: Identity,

      url: function () {
        return globals.API_ROOT + '/identity' + globals.slash();
      }

    });

  });
