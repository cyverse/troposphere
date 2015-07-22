define(
  [
    'backbone',
    'globals',
    'moment'
  ],
  function (Backbone, globals, moment) {

    return Backbone.Model.extend({

      urlRoot: function () {
        var creds = this.creds;
        var url = globals.API_V2_ROOT +
          '/provider_machines';
        return url;
      },

      parse: function (attributes) {
        attributes.start_date = moment(attributes.start_date);
        attributes.end_date = moment(attributes.end_date);
        return attributes;
      }

    });

  });
