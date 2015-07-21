define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    ProjectInstance = require('models/ProjectInstance'),
    globals = require('globals');

  return Backbone.Collection.extend({
    model: ProjectInstance,

    url: globals.API_V2_ROOT + "/project_instances",

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
