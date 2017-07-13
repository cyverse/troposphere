import Backbone from "backbone";

import globals from "globals";
import AllocationSource from "models/AllocationSource";
import { api } from "mock/allocationSources";
import mockSync from "utilities/mockSync";

export default Backbone.Collection.extend({
    model: AllocationSource,

    url: globals.API_V2_ROOT + "/allocation_sources",

    parse: function(response) {
        // Ensure the api returns values for these fields
        let defaults = {
            compute_used: 100,
            compute_allowed: 1000,
            name: "dummy"
        };

        let results = response.results.map(source => {
            Object.keys(defaults).forEach(f => {
                if (source[f] == null) {
                    source[f] = defaults[f];
                }
            });
            return source;
        });
        return results;
    },

    sync: globals.USE_MOCK_DATA
        ? mockSync(api)
        : Backbone.sync
});
