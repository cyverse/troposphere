define(
  [
    'underscore',
    'backbone',
    'globals',
    'moment'
  ],
  function (_, Backbone, globals, moment) {

    var Project = Backbone.Model.extend({
      urlRoot: globals.API_V2_ROOT + "/providers",

      parse: function (response) {
        response.start_date = moment(response.start_date);
        response.end_date = moment(response.end_date);
        return response;
      }

    });

    return Project;

  });
