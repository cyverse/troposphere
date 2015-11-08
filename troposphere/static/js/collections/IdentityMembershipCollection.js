define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
    IdentityMembership = require('models/IdentityMembership'),
    globals = require('globals');

  return Backbone.Collection.extend({
    model: IdentityMembership,

    url: globals.API_V2_ROOT + "/identity_memberships",

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
