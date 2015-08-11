define(function(require){
  "use strict";

  var Backbone = require('backbone'),
      ImageVersionScript = require('models/ImageVersionScript'),
      globals = require('globals');

  return Backbone.Collection.extend({
    model: ImageVersionScript,

    url: globals.API_V2_ROOT + "/image_version_boot_scripts",

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
