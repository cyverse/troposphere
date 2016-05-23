import Backbone from 'backbone';
import InstanceTag from 'models/InstanceTag';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: InstanceTag,

    url: globals.API_V2_ROOT + "/instance_tags",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }
});
