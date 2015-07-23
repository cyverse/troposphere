define(function(require){
  "use strict";

  var Backbone = require('backbone'),
      ImageversionMembership = require('models/ImageVersionMembership'),
      globals = require('globals');

  return Backbone.Collection.extend({
    model: ImageversionMembership,

    url: globals.API_V2_ROOT + "/image_version_memberships",

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
