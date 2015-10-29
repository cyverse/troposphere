import Backbone from 'backbone';
import ProjectVolume from 'models/ProjectVolume';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: ProjectVolume,

    url: globals.API_V2_ROOT + "/project_volumes",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }

});
