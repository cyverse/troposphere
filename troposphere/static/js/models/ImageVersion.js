define(function (require) {

  var _ = require('underscore'),
      Backbone = require('backbone'),
      globals = require('globals'),
      stores = require('stores'),
      ProviderMachineCollection = require('../collections/ProviderMachineCollection'),
      moment = require('moment');

  return Backbone.Model.extend({

    urlRoot: globals.API_V2_ROOT + "/image_versions",

    parse: function (attributes) {

      attributes.start_date = moment(attributes.start_date);
      attributes.end_date = moment(attributes.end_date);
      attributes.description = attributes.description || "";

      return attributes;
    },

    getMachines: function() {
        var _machines = stores.ProviderMachineStore.fetchWhere(
            {version_id: this.id}
        );

        if(!_machines || _machines.length === 0) {
            return null;
        }
        //MOVE AWAY from backbone!
        return _machines.toJSON();
    }

  });

});
