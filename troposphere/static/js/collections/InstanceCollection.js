import Backbone from 'backbone';
import _ from 'underscore';
import globals from 'globals';
import Instance from 'models/Instance';

export default Backbone.Collection.extend({
    model: Instance,

    url: globals.API_V2_ROOT + "/instances",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }

});
