define(
  [
    'backbone',
    'models/Tag',
    'globals'
  ],
  function (Backbone, Tag, globals) {

    return Backbone.Collection.extend({
      model: Tag,

      url: function () {
        return globals.API_V2_ROOT + "/tags" + globals.slash();
      },

      comparator: function (model) {
        return model.get('name').toLowerCase();
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
