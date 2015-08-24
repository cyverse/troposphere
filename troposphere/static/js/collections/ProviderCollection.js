define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    Provider = require('models/Provider'),
    globals = require('globals');

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
    },
    comparator: function(a, b) {
        return a.id - b.id;
    }

  });

});
