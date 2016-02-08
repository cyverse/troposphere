define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    ProjectImage = require('models/ProjectImage'),
    globals = require('globals');

  return Backbone.Collection.extend({
    model: ProjectImage,

    url: globals.API_V2_ROOT + "/project_images",

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
