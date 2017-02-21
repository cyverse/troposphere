import Backbone from "backbone";

import globals from "globals";

export default Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/instance_actions"
});
