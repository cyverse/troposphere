define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
      ImageVersion = require('models/ImageVersion'),
      globals = require('globals');

  return Backbone.Collection.extend({
    model: ImageVersion,

    url: globals.API_V2_ROOT + "/image_versions",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    },

    comparator: function (a, b) {
      return b.get('start_date').diff(a.get('start_date'), "seconds");
    }

  });

});
