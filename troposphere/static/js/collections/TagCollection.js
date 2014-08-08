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
        return globals.API_ROOT + "/tag" + globals.slash();
      },

      comparator: function (model) {
        return model.get('name').toLowerCase();
      }

    });

  });
