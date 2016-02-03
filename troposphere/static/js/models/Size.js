define(
  [
    'underscore',
    'backbone',
    'globals',
    'moment'
  ],
  function (_, Backbone, globals, moment) {

    return Backbone.Model.extend({

      urlRoot: globals.API_V2_ROOT + "/sizes",

      parse: function (response) {
        response.mem = response.mem / 1024;
        response.start_date = moment(response.start_date);
        response.end_date = moment(response.end_date);
        return response;
      },

      formattedDetails: function () {
        var parts = [
          this.get('cpu') + ' CPUs',
          this.get('mem') + ' GB memory'
        ];
        if (this.get('disk')) {
          parts.push(this.get('disk') + ' GB disk');
        }
        if (this.get('root')) {
          parts.push(this.get('root') + ' GB root');
        }

        return this.get('name') + " (" + parts.join(', ') + ")";
      }

    });

  });
