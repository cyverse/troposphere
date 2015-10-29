import Backbone from 'backbone';
import User from 'models/User';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: User,

    url: globals.API_V2_ROOT + "/users",

    comparator: function (model) {
      var username = model.get('username');
      if (username)
        return model.get('username').toLowerCase();
      return username;
    },

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }

});
