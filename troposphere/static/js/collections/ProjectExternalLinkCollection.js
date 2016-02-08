define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    ProjectExternalLink = require('models/ProjectExternalLink'),
    globals = require('globals');

  return Backbone.Collection.extend({
    model: ProjectExternalLink,

    url: globals.API_V2_ROOT + "/project_links",

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
