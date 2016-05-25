import Backbone from 'backbone';
import ProjectImage from 'models/ProjectImage';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: ProjectImage,

    url: globals.API_V2_ROOT + "/project_images",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }
});
