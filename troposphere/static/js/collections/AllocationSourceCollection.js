import Backbone from "backbone";

import globals from "globals";
import AllocationSource from "models/AllocationSource";
import { api } from "mock/allocationSources";
import mockSync from "utilities/mockSync";

export default Backbone.Collection.extend({
    model: AllocationSource,

    url: globals.API_V2_ROOT + "/allocation_sources",

    parse: function(response) {

        console.warn("We may be tampering with data until the api settles");
        // Ensure the api returns values for these fields
        let defaults = {
            compute_used: 100,
            compute_allowed: 1000,
            name: "dummy"
        };

        let results = response.results.map(source => {
            Object.keys(defaults).forEach(f => {
                if (source[f] == null) {
                    console.warn("We are tampering with data " + f + " until the api settles");
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
