import Backbone from 'backbone';
import ImageVersionScript from 'models/ImageVersionScript';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: ImageVersionScript,

    url: globals.API_V2_ROOT + "/image_version_boot_scripts",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }
});
