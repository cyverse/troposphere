define(
  [
    'backbone',
    'moment'
  ],
  function (Backbone, moment) {

    return Backbone.Model.extend({

      parse: function (response) {
        var attributes = response;
        attributes.start_date = moment(attributes.start_date);
        attributes.end_date = moment(attributes.end_date);
        return attributes;
      }

    });

  });
