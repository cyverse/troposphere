define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    InstanceTag = require('models/InstanceTag'),
    globals = require('globals');

  return Backbone.Collection.extend({
    model: InstanceTag,

    url: globals.API_V2_ROOT + "/instance_tags",

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
