define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    _ = require('underscore'),
    Size = require('models/Size'),
    globals = require('globals');

  return Backbone.Collection.extend({
    model: Size,

    url: globals.API_V2_ROOT + "/sizes",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    },

    comparator: function (sizeA, sizeB) {
      var aliasA = parseInt(sizeA.get('alias'));
      var aliasB = parseInt(sizeB.get('alias'));

      if (aliasA === aliasB) return 0;
      return aliasA < aliasB ? -1 : 1;
    }

  });

});
