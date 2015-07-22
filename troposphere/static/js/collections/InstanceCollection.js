define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    _ = require('underscore'),
    globals = require('globals'),
    Instance = require('models/Instance');

  return Backbone.Collection.extend({
    model: Instance,

    url: globals.API_V2_ROOT + "/instances",

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
