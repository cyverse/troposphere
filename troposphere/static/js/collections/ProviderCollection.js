define(
  [
    'backbone',
    'models/Provider',
    'globals'
  ],
  function (Backbone, Provider, globals) {

    return Backbone.Collection.extend({
      model: Provider,

      url: globals.API_V2_ROOT + "/providers",

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
