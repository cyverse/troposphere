import Backbone from 'backbone';
import IdentityMembership from 'models/IdentityMembership';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: IdentityMembership,

    url: globals.API_V2_ROOT + "/identity_memberships",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };
      return response.results;
    }
});
