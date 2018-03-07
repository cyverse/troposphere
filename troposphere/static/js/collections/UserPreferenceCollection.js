import Backbone from "backbone";

import UserPreference from "models/UserPreference";
import globals from "globals";


export default Backbone.Collection.extend({
    model: UserPreference,

    url: globals.TROPO_API_ROOT + "/user_preferences",

    parse: function(response) {
        this.meta = {
            count: response.count,
            next: response.next,
            previous: response.previous
        };

        return response.results;
    }
});
