import Backbone from 'backbone';
import Status from 'models/Status';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: Status,

    url: globals.API_V2_ROOT + "/status_types",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }
});
