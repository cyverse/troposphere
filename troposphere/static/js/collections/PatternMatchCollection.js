import Backbone from "backbone";
import PatternMatch from "models/PatternMatch";
import globals from "globals";

export default Backbone.Collection.extend({
    model: PatternMatch,

    url: globals.API_V2_ROOT + "/pattern_matches",

    comparator: function(model) {
        let pattern = model.get("pattern");
        if (!pattern) {
            return pattern;
        }
        return pattern.toLowerCase();
    },

    parse: function(response) {
        this.meta = {
            count: response.count,
            next: response.next,
            previous: response.previous
        };

        return response.results;
    }

});
