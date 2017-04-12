import Backbone from "backbone";
import globals from "globals";
import moment from "moment";

export default Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/sizes",

    initialize: function(attributes, option) {
        return Object.assign({}, attributes, {
            mem: attributes.mem / 1024,
            start_date : moment(attributes.start_date),
            end_date : moment(attributes.end_date)
        });
    },

    formattedDetails: function() {
        var parts = [
            this.get("cpu") + " CPUs",
            this.get("mem") + " GB memory"
        ];
        if (this.get("disk")) {
            parts.push(this.get("disk") + " GB disk");
        }
        if (this.get("root")) {
            parts.push(this.get("root") + " GB root");
        }

        return this.get("name") + " (" + parts.join(", ") + ")";
    }
});
