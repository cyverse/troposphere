define(
  [
    'backbone',
    'underscore',
    'globals',
    'models/Volume'
  ],
  function (Backbone, _, globals, Volume) {

    return Backbone.Collection.extend({
      model: Volume,

      url: globals.API_V2_ROOT + '/volumes',

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
