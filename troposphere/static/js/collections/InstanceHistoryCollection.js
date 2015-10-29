import InstanceCollection from './InstanceCollection';
import InstanceHistory from 'models/InstanceHistory';
import globals from 'globals';

export default InstanceCollection.extend({
    model: InstanceHistory,

    url: globals.API_V2_ROOT + '/instance_histories',

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
