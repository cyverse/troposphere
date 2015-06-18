define(function (require) {

  var _ = require('underscore'),
      Backbone = require('backbone'),
      globals = require('globals'),
      stores = require('stores'),
      ProviderMachine = require('models/ProviderMachine'),
      ProviderMachineCollection = require('collections/ProviderMachineCollection'),
      moment = require('moment');

  return Backbone.Model.extend({

    urlRoot: globals.API_V2_ROOT + "/images",

    parse: function (attributes) {
      // todo: move this feature into ImageBookmarksStore
      attributes.isFavorited = true; //response.is_bookmarked;
      attributes.start_date = moment(attributes.start_date);
      attributes.end_date = moment(attributes.end_date);
      attributes.description = attributes.description || "";

      return attributes;
    },

    toJSON: function (options) {
      var attributes = _.clone(this.attributes);
      attributes.is_bookmarked = attributes.isFavorited;
      delete attributes['isFavorited'];
      return attributes;
    }

  });

});
