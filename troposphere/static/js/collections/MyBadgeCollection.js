define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
      Badge = require('models/Badge'),
      globals = require('globals');

  return Backbone.Collection.extend({
    model: Badge,
    url: globals.BADGE_HOST + "/user",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
     };
      return response.instances.map(function(instance){
        return instance.badge;
      });
    }
  });

});