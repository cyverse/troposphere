import Backbone from 'backbone';
import globals from 'globals';

export default Backbone.Model.extend({

    urlRoot: globals.API_V2_ROOT + "/help_links",

    idAttribute: "link_key",

    parse: function (attributes) {
        return attributes;
    },
});
