define(function (require) {

  var Backbone = require('backbone'),
      globals = require('globals');

  return Backbone.Model.extend({
    url: globals.API_V2_ROOT + "/allocations"
  });

});
