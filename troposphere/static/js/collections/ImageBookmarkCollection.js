import Backbone from 'backbone';
import ImageBookmark from 'models/ImageBookmark';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: ImageBookmark,

    url: globals.API_V2_ROOT + "/image_bookmarks",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }

});
