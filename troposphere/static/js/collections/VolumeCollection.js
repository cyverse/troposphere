import Backbone from 'backbone';
import _ from 'underscore';
import Volume from 'models/Volume';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: Volume,

    url: globals.API_V2_ROOT + '/volumes',

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }
});
