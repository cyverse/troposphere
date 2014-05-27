define(
  [
    'backbone',
    'models/project',
    'globals'
  ],
  function (Backbone, Project, globals) {

    return Backbone.Collection.extend({
      model: Project,

      url: function () {
        return globals.API_ROOT + "/project" + globals.slash();
      },

      comparator: function (model) {
        return -1 * model.get('start_date');
      }

    });

  });
