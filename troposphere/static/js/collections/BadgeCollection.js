import Backbone from 'backbone';
import Badge from 'models/Badge';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: Badge,
    url: globals.BADGE_HOST,

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
     };
      return response.badges;
    }
});
