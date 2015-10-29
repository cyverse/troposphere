import Backbone from 'backbone';
import Membership from 'models/Membership';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: Membership,

    url: globals.API_V2_ROOT + "/groups",

    comparator: function (model) {
      var name = model.get('name');
      if(name)
          return model.get('name').toLowerCase();
      return name;
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
