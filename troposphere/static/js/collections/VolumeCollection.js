define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
      _ = require('underscore'),
      Volume = require('models/Volume'),
      globals = require('globals');

  return Backbone.Collection.extend({
    model: Volume,

    url: globals.API_V2_ROOT + '/volumes',

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
