import Backbone from 'backbone';
import ImageversionMembership from 'models/ImageVersionMembership';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: ImageversionMembership,

    url: globals.API_V2_ROOT + "/image_version_memberships",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }
});
