define(function(require){
  "use strict";

  var Backbone = require('backbone'),
      globals = require('globals');

  return Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/image_bookmarks"
  });

});
