import Backbone from 'backbone';
import Identity from 'models/Identity';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: Identity,

    url: globals.API_V2_ROOT + '/identities',

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    },
    comparator: function(a, b) {
        return a.id - b.id;
    }
});
