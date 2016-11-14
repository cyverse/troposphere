import Backbone from "backbone";

import globals from "globals";
import Instance from "models/Instance";
import { api } from "mock/instances";
import mockSync from "utilities/mockSync";

export default Backbone.Collection.extend({
    model: Instance,

    url: globals.API_V2_ROOT + "/instances",

    parse: function(response) {
        this.meta = {
            count: response.count,
            next: response.next,
            previous: response.previous
        };

        return response.results;
    },

    sync: globals.USE_MOCK_DATA
        ? mockSync(api)
        : Backbone.sync
});
