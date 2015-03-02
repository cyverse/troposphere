define(
  [
    'backbone',
    'models/Tag',
    'globals'
  ],
  function (Backbone, Tag, globals) {

    return Backbone.Collection.extend({
      model: Tag,

      url: globals.API_V2_ROOT + "/tags",

      comparator: function (model) {
        return model.get('name').toLowerCase();
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
