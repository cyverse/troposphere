define(
  [
    'backbone',
    'underscore',
    'models/Size',
    'globals'
  ],
  function (Backbone, _, Size, globals) {

    return Backbone.Collection.extend({
      model: Size,

      url: function () {
        return globals.API_V2_ROOT + "/sizes?page_size=100" + globals.slash();
      },

      parse: function (response) {
        this.meta = {
          count: response.count,
          next: response.next,
          previous: response.previous
        };

        return response.results;
      },

      comparator: function (sizeA, sizeB) {
        var aliasA = sizeA.get('alias').toLowerCase();
        var aliasB = sizeB.get('alias').toLowerCase();

        if(aliasA === aliasB) return 0;
        return aliasA < aliasB ? -1 : 1;
      }

    });

  });
