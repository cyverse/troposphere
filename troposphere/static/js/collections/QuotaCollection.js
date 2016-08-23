import Backbone from 'backbone';
import Quota from 'models/Quota';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: Quota,
    url: globals.API_V2_ROOT + "/quotas",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }
});
