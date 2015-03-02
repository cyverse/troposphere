define(
  [
    'backbone',
    'models/Identity',
    'globals'
  ],
  function (Backbone, Identity, globals) {

    return Backbone.Collection.extend({
      model: Identity,

      url: globals.API_V2_ROOT + '/identities',

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
