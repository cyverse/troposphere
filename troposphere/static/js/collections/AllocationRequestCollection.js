define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
      AllocationRequest = require('models/AllocationRequest'),
      globals = require('globals');

  return Backbone.Collection.extend({
    model: AllocationRequest,

    url: globals.API_V2_ROOT + "/allocation_requests",

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
