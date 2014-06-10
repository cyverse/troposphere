define(
  [
    'backbone',
    'models/Identity',
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
