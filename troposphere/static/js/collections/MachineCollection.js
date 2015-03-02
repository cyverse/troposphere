define(
  [
    'backbone',
    'underscore',
    'globals',
    'models/Machine'
  ],
  function (Backbone, _, globals, Machine) {

    return Backbone.Collection.extend({
      model: Machine,

      url: globals.API_V2_ROOT + '/provider_machines',

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
