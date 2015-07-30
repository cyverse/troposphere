define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    QuotaStatus = require('models/QuotaStatus'),
    globals = require('globals');

  return Backbone.Collection.extend({
    model: QuotaStatus,

    url: globals.API_V2_ROOT + "/status_types",

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
