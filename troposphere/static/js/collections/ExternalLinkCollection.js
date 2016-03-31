import Backbone from 'backbone';
import ExternalLink from 'models/ExternalLink';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: ExternalLink,

    url: globals.API_V2_ROOT + "/links",

    comparator: function (model) {
      name = model.get('name')
      if(!name) {
          return name;
      }
      return name.toLowerCase();
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
