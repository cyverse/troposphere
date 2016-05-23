import Backbone from 'backbone';
import Tag from 'models/Tag';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: Tag,

    url: globals.API_V2_ROOT + "/tags",

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
