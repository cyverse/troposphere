import Backbone from 'backbone';
import _ from 'underscore';
import globals from 'globals';
import Machine from 'models/ProviderMachine';

export default Backbone.Collection.extend({
    model: Machine,

    url: globals.API_V2_ROOT + '/provider_machines',

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }

});
