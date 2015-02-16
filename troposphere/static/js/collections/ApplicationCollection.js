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
        return globals.API_V2_ROOT + "/images" + globals.slash();
      },

      parse: function (response) {
        this.meta = {
          count: response.count,
          next: response.next,
          previous: response.previous
        };

        return response.results;
      },

      comparator: function (a, b) {
        return b.get('start_date').diff(a.get('start_date'), "seconds");
      }

    });

  });
