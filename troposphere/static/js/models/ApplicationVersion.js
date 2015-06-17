define(function (require) {

  var _ = require('underscore'),
      Backbone = require('backbone'),
      globals = require('globals'),
      stores = require('stores'),
      Application = require('models/Application'),
      moment = require('moment');

  return Backbone.Model.extend({

    urlRoot: globals.API_V2_ROOT + "/image_versions",

    parse: function (attributes) {
      // todo: move this feature into ImageBookmarksStore
      attributes.isFavorited = true; //response.is_bookmarked;

      // todo: handle this through the ProviderMachine store
      var attrs = attributes.image,
          image = new Application(Application.prototype.parse(attrs));

      attributes.application = image;
      attributes.start_date = moment(attributes.start_date);
      attributes.end_date = moment(attributes.end_date);
      attributes.description = attributes.description || "";

      return attributes;
    },

  });

});
