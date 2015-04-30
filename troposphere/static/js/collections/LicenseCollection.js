define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
      _ = require('underscore'),
      globals = require('globals'),
      Machine = require('models/License');

  return Backbone.Collection.extend({
    model: Machine,

    url: globals.API_V2_ROOT + '/licenses',

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
