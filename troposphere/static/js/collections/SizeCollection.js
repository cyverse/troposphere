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
      var cpu_a = parseInt(sizeA.get('cpu'));
      var cpu_b = parseInt(sizeB.get('cpu'));
      var mem_a = parseInt(sizeA.get('mem'));
      var mem_b = parseInt(sizeB.get('mem'));

      if (cpu_a === cpu_b) return mem_a < mem_b ? -1 : 1;
      return cpu_a < cpu_b ? -1 : 1;
    }

  });

});
