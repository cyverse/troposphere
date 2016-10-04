import Backbone from "backbone";
import Size from "models/Size";
import globals from "globals";

export default Backbone.Collection.extend({
    model: Size,

    url: globals.API_V2_ROOT + "/sizes",

    parse: function(response) {
        this.meta = {
            count: response.count,
            next: response.next,
            previous: response.previous
        };

        return response.results;
    },

    comparator: function(lhs, rhs) {
        var lhsCPU = parseInt(lhs.get("cpu"));
        var rhsCPU = parseInt(rhs.get("cpu"));

        if (lhsCPU === rhsCPU) {
            var lhsRAM = parseInt(lhs.get("mem")),
                rhsRAM = parseInt(rhs.get("mem"));
            return lhsRAM - rhsRAM;
        }
        return lhsCPU < rhsCPU ? -1 : 1;
    }

});
