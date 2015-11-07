import Backbone from 'backbone';
import globals from 'globals';

export Backbone.Model.extend({
    url: globals.API_V2_ROOT + "/quotas"
});
