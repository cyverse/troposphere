define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    Tag = require('models/Tag'),
    globals = require('globals');

  return Backbone.Collection.extend({
    model: Tag,

    url: globals.API_V2_ROOT + "/tags",

    comparator: function (model) {
      return model.get('name').toLowerCase();
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
