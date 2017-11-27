import Backbone from "backbone";
import globals from "globals";

export default Backbone.Model.extend({

    url: function() {
        return globals.API_V2_ROOT + "/instance_commands";
    }
});
