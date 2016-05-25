import Backbone from 'backbone';
import ProjectExternalLink from 'models/ProjectExternalLink';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: ProjectExternalLink,

    url: globals.API_V2_ROOT + "/project_links",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }
});
