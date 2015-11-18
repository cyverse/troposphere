define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
      SSHKey = require('models/SSHKey');

  return Backbone.Collection.extend({
    model: SSHKey,
    url: API_V2_ROOT + "/ssh_keys",
    parse: function(data) {
        return data.results;
    },
  });

});
