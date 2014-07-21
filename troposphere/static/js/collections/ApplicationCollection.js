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
        return globals.API_ROOT + "/application" + globals.slash();
      },

      parse: function (response) {
        var count = response.count;
        var next = response.next;
        var previous = response.previous;
        var results = response.results;
        return results;
      }

    });

  });
