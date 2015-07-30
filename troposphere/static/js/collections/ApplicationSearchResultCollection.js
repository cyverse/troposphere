define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    Application = require('models/Application'),
    globals = require('globals');

  return Backbone.Collection.extend({
    model: Application,

    initialize: function (models, options) {
      if (options.query) this.query = options.query;
    },

    url: function () {
      return globals.API_V2_ROOT + "/images?search=" + encodeURIComponent(this.query);
    },

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
