define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
      QuotaRequest = require('models/QuotaRequest'),
      globals = require('globals');

  return Backbone.Collection.extend({
    model: QuotaRequest,

    url: globals.API_V2_ROOT + "/resource_requests",

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
