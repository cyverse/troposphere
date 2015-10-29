import Backbone from 'backbone';
import ImageRequest from 'models/ImageRequest';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: ImageRequest,

    url: globals.API_V2_ROOT + "/machine_requests",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };
      return response.results;
    }

});
