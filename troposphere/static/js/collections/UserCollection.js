define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
      User = require('models/User'),
      globals = require('globals');

  return Backbone.Collection.extend({
    model: User,

    url: globals.API_V2_ROOT + "/users",

    comparator: function (model) {
      return model.get('username').toLowerCase();
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
