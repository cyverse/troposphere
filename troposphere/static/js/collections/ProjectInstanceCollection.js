import Backbone from 'backbone';
import ProjectInstance from 'models/ProjectInstance';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: ProjectInstance,

    url: globals.API_V2_ROOT + "/project_instances",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }

});
