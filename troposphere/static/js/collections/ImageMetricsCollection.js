import Backbone from "backbone";
import ImageMetrics from "models/ImageMetrics";
import globals from "globals";

export default Backbone.Collection.extend({
    model: ImageMetrics,

    url: globals.API_V2_ROOT + "/image_metrics",

    parse: function(response) {
        this.meta = {
            count: response.count,
            next: response.next,
            previous: response.previous
        };

        return response.results;
    }

    //comparator: function(a, b) {
    //    return b.get("id") - a.get("id")
    //}
});
