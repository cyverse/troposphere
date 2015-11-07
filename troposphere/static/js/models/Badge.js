import Backbone from 'backbone';
import globals from 'globals';

export default Backbone.Model.extend({
    urlRoot: globals.BADGE_HOST
});
