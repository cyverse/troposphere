define(
  [
    'backbone',
    'models/Project',
    'globals'
  ],
  function (Backbone, Project, globals) {

    return Backbone.Collection.extend({
      model: Project,

      url: function () {
        return globals.API_ROOT + "/project" + globals.slash();
      },

      comparator: function (projectA, projectB) {
        var nameA = projectA.get('name').toLowerCase();
        var nameB = projectB.get('name').toLowerCase();

        if(nameA === "Default") return -1;
        if(nameB === "Default") return 1;
        if(nameA === nameB) return 0;
        return nameA < nameB ? -1 : 1;
      }

    });

  });
