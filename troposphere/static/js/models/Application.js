define(function (require) {

  var _ = require('underscore'),
      Backbone = require('backbone'),
      globals = require('globals'),
      Machine = require('models/Machine'),
      MachineCollection = require('collections/MachineCollection'),
      moment = require('moment');

  return Backbone.Model.extend({

    urlRoot: globals.API_V2_ROOT + "/images",

    parse: function (attributes) {
      // todo: move this feature into ImageBookmarksStore
      attributes.isFavorited = true; //response.is_bookmarked;

      // todo: handle this through the ProviderSnapshot store
      //var machines = _.map(attributes.machines, function (attrs) {
      //  return new Machine(Machine.prototype.parse(attrs));
      //});
      attributes.machines = new MachineCollection([]);
      attributes.start_date = moment(attributes.start_date);
      attributes.end_date = moment(attributes.end_date);

      return attributes;
    },

    toJSON: function (options) {
      var attributes = _.clone(this.attributes);
      attributes.is_bookmarked = attributes.isFavorited;
      delete attributes['isFavorited'];
      return attributes;
    },

    favorited: function(isFavorited){
      var actionUrl = globals.API_ROOT + "/bookmark/application/" + this.id + globals.slash();
      var data = {
        marked: isFavorited
      };

      var promise = $.ajax({
        url: actionUrl,
        type: "PUT",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json'
      });
      return promise;
    }

  });

});
