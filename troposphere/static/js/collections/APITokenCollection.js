import Backbone from "backbone";

import APIToken from "models/APIToken";
import globals from "globals";

export default Backbone.Collection.extend({
    model: APIToken,
    url: globals.API_V2_ROOT + "/access_tokens",
    parse: function(data) {
        return data.results;
    }
});
