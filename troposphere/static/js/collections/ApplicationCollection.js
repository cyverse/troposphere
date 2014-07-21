define(
  [
    'backbone',
    'models/Application',
    'globals'
  ],
  function (Backbone, Application, globals) {

    return Backbone.Collection.extend({
      model: Application,

      url: function () {
        return globals.API_ROOT + "/application" + globals.slash() + "?page=1";
      },

      parse: function (response) {
        this.meta = {
          count: response.count,
          next: response.next,
          previous: response.previous
        };

        return response.results;
      }

    });

  });
