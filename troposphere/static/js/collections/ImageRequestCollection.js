define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    ImageRequest = require('models/ImageRequest'),
    globals = require('globals');

  return Backbone.Collection.extend({
    model: ImageRequest,

    url: globals.API_V2_ROOT + "/machine_requests",

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
