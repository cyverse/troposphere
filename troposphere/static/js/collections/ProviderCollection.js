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
        return globals.API_V2_ROOT + "/providers" + globals.slash();
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
