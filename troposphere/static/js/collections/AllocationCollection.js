define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    Allocation = require('models/Allocation'),
    globals = require('globals');

  return Backbone.Collection.extend({
    model: Allocation,
    url: globals.API_V2_ROOT + "/allocations",

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
