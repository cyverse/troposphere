import Backbone from "backbone";
import globals from "globals";
import moment from "moment";

export default Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/sizes",

    parse: function (response) {
        return Object.assign({}, response, {
            mem: response.mem / 1024,
            start_date: moment(response.start_date),
            end_date: moment(response.end_date)
        });
    },

    hasResources: function() {
        let resources = [this.get("cpu"), this.get("mem")];

        if (this.get("disk")) {
            resources.push(this.get("disk"));
        }

        return resources.every((r) => r > 0);
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
        let details = this.hasResources() ? `(${parts.join(", ")})` : "";

        return `${this.get("name")} ${details}`;
    }
});
