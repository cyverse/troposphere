import Backbone from 'backbone';
import globals from 'globals';

export default Backbone.Model.extend({
      url: globals.API_ROOT + "/version"
});
