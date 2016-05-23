import Backbone from 'backbone';
import ResourceRequest from 'models/ResourceRequest';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: ResourceRequest,

    url: globals.API_V2_ROOT + "/resource_requests",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };
      return response.results;
    }

});
