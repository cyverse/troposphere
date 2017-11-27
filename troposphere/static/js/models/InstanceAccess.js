import Backbone from "backbone";
import globals from "globals";

export default Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/instance_access",

    create: function(options, cb) {
        if (!options.instance)
            throw new Error("Missing instance");
        if (!options.user)
            throw new Error("Missing user");

        let { instance, user } = options;

        var url = globals.API_V2_ROOT + "/instance_access";

        let attrs = {
            instance,
            user,
        }

        return Backbone.sync("create", this, {
            url,
            attrs
        });
    },
});
