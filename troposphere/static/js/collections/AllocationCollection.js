import Backbone from 'backbone';
import Allocation from 'models/Allocation';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: Allocation,
    url: globals.API_V2_ROOT + "/allocations",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };
      return response.results;
    }
});
