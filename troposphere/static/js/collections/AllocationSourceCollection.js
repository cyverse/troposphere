import Backbone from "backbone";

import globals from "globals";
import AllocationSource from "models/AllocationSource";
import { api } from "mock/allocationSources";
import mockSync from "utilities/mockSync";

export default Backbone.Collection.extend({
    model: AllocationSource,

    url: globals.API_V2_ROOT + "/allocation_sources",

    parse: function(response) {
        return response.results;
    },

    sync: globals.USE_MOCK_DATA
        ? mockSync(api)
        : Backbone.sync
});
