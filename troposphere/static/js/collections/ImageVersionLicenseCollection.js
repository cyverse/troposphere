import Backbone from 'backbone';
import ImageVersionLicense from 'models/ImageVersionLicense';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: ImageVersionLicense,

    url: globals.API_V2_ROOT + "/image_version_licenses",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }

});
