define(function (require) {

  var Backbone = require('backbone');

  return Backbone.Model.extend({
    url: "/tropo-api/version"
  });

});
