import Backbone from "backbone";
import ImagePatternMatch from "models/ImagePatternMatch";
import globals from "globals";

export default Backbone.Collection.extend({
    model: ImagePatternMatch,

    url: globals.API_V2_ROOT + "/image_access_lists",

    parse: function(response) {
        this.meta = {
            count: response.count,
            next: response.next,
            previous: response.previous
        };

        return response.results;
    }
});
