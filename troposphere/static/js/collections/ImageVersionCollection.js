import Backbone from 'backbone';
import ImageVersion from 'models/ImageVersion';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: ImageVersion,

    url: globals.API_V2_ROOT + "/image_versions",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    },

    comparator: function (a, b) {
      return b.get('start_date').diff(a.get('start_date'), "seconds");
    }

});
