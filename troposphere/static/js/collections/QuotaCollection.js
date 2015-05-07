define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
      Quota = require('models/Quota'),
      globals = require('globals');

  return Backbone.Collection.extend({
    model: Quota,
    url: globals.API_V2_ROOT + "/quotas",

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