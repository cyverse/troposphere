define(function(require){
  "use strict";

  var Backbone = require('backbone'),
      ProjectVolume = require('models/ProjectVolume'),
      globals = require('globals');

  return Backbone.Collection.extend({
    model: ProjectVolume,

    url: globals.API_V2_ROOT + "/project_volumes",

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