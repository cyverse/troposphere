import Backbone from "backbone";
import globals from "globals";

export default Backbone.Model.extend({

    initialize: function(attrs, options) {
        var instance = attrs.instance;
        if (!instance)
            throw new Error("Missing instance");
        if (!instance.get("uuid"))
            throw new Error("Missing instance.uuid");
    },

    url: function() {
        var instance = this.get("instance"),
            instanceId = instance.get("uuid");

        return (
        globals.API_V2_ROOT +
        "/instances/" + instanceId +
        "/actions"
        )
    }
});
