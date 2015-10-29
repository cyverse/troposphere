import Backbone from 'backbone';
import _ from 'underscore';
import globals from 'globals';
import Machine from 'models/License';

export default Backbone.Collection.extend({
    model: Machine,

    url: globals.API_V2_ROOT + '/licenses',

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }
});
