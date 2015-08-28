define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
      Badge = require('models/Badge'),
      globals = require('globals');

  return Backbone.Collection.extend({
    model: Badge,
    url: globals.BADGE_HOST + "/1",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
     };
      return response.instances.map(function(instance){
        instance.badge.assertionUrl = instance.assertionUrl;
        instance.badge.issuedOn = instance.issuedOn;
        return instance.badge;
      });
    }
  });

});
