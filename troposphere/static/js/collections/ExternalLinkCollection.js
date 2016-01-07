define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    ExternalLink = require('models/ExternalLink'),
    globals = require('globals');

  return Backbone.Collection.extend({
    model: ExternalLink,

    url: globals.API_V2_ROOT + "/links",

    comparator: function (model) {
      name = model.get('name')
      if(!name) {
          return name;
      }
      return name.toLowerCase();
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
