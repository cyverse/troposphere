define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
      MaintenanceMessage = require('models/MaintenanceMessage'),
      globals = require('globals'),
      moment = require('moment');

  return Backbone.Collection.extend({
    model: MaintenanceMessage,

    url: function () {
      return globals.API_ROOT + "/maintenance";
    },

    parse: function(results){
      var currentDate = moment();
      results = results.filter(function(result){
        var hasProvider = result.provider_id;
        var endDate = moment(result.end_date);
        var isCurrentOrFutureMaintenance = currentDate.diff(endDate) < 0;
        return isCurrentOrFutureMaintenance && hasProvider;
      });
      return results;
    },

    comparator: function (a, b) {
      return b.get('start_date').diff(a.get('start_date'), "seconds");
    }

  });

});
