import Backbone from "backbone";
import Group from "models/Group";
import globals from "globals";

export default Backbone.Collection.extend({
    model: Group,

    url: globals.API_V2_ROOT + "/groups",

    comparator: function(model) {
        var groupname = model.get("name");
        if (groupname)
            return groupname.toLowerCase();
        return groupname;
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
