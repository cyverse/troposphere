define(function(require){
  "use strict";

  var Backbone = require('backbone'),
      ImageVersionLicense = require('models/ImageVersionLicense'),
      globals = require('globals');

  return Backbone.Collection.extend({
    model: ImageVersionLicense,

    url: globals.API_V2_ROOT + "/image_version_licenses",

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
