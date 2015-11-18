define(function (require) {

  var Backbone = require('backbone');

  return Backbone.Model.extend({
    urlRoot: API_V2_ROOT + "/ssh_keys",
  });

});
