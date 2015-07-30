define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    ImageBookmark = require('models/ImageBookmark'),
    globals = require('globals');

  return Backbone.Collection.extend({
    model: ImageBookmark,

    url: globals.API_V2_ROOT + "/image_bookmarks",

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
