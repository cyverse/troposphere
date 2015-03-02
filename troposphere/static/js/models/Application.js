define(
  [
    'underscore',
    'backbone',
    'globals',
    'models/Machine',
    'collections/MachineCollection',
    'moment'
  ],
  function (_, Backbone, globals, Machine, MachineCollection, moment) {

    return Backbone.Model.extend({

      urlRoot: globals.API_V2_ROOT + "/images",

      url: function () {
        var url = Backbone.Model.prototype.url.apply(this) + globals.slash();
        return url;
      },

      parse: function (response) {
        var attributes = response;
        attributes.votes = {
          up: Math.floor(Math.random() * 100),
          down: Math.floor(Math.random() * 100)
        };

        // todo: move this feature into ImageBookmarksStore
        attributes.isFavorited = true; //response.is_bookmarked;

        // todo: handle this through the ProviderSnapshot store
        //var machines = _.map(attributes.machines, function (attrs) {
        //  return new Machine(Machine.prototype.parse(attrs));
        //});
        var machines = [];
        attributes.machines = new MachineCollection(machines);
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
