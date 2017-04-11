import Backbone from "backbone";

import InstanceAction from "models/InstanceAction";

import globals from "globals";

export default Backbone.Collection.extend({
    model: InstanceAction,

    initialize: function(models, options) {
        if (options.alias)
            this.alias = options.alias;
    },

    url: function() {
        return `${globals.API_V2_ROOT}/instances/${this.alias}/actions`;
    },
});
