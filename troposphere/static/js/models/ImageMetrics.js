import _ from "underscore";
import Backbone from "backbone";
import globals from "globals";

export default Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/image_metrics",

    parse: function(attributes) {
        return attributes;
    },

    toJSON: function(options) {
        var attributes = _.clone(this.attributes);
        return attributes;
    }
});
