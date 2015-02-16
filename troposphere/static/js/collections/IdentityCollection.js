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
        return globals.API_V2_ROOT + '/identities' + globals.slash();
      },

      parse: function (response) {
        this.meta = {
          count: response.count,
          next: response.next,
          previous: response.previous
        };

        return response.results;
      }

    });

  });
