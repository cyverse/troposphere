import Backbone from 'backbone';
import Project from 'models/Project';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: Project,

    url: globals.API_V2_ROOT + "/projects",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    },

    comparator: function (projectA, projectB) {
      var nameA = projectA.get('name').toLowerCase();
      var nameB = projectB.get('name').toLowerCase();

      if (nameA === "default") return -1;
      if (nameB === "default") return 1;
      if (nameA === nameB) return 0;
      return nameA < nameB ? -1 : 1;
    }
});
