define(function (require) {

  var Backbone = require('backbone'),
      globals = require('globals');

  return Backbone.Model.extend({
    urlRoot: globals.API_V2_MOCK_ROOT + "/quota_requests"
  });

});
