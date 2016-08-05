import backbone from 'backbone';
import AllocationSource from 'models/AllocationSource';
import globals from 'globals';
import $ from 'jquery';
import _ from 'underscore';

import allocationSources from 'mockdata/allocationSources.json';

export default backbone.Collection.extend({
    model: AllocationSource,

    url: globals.API_V2_ROOT + "/allocation_sources",

    parse: function (response) {
        console.warn("We are tampering with data until the api settles");

        let defaults = {
            compute_used: 100,
            compute_allowed: 1000,
            name: "dummy"
        };

        let results = response.results.map(source => {
            Object.keys(defaults).forEach(f => {
                if (!source[f]) {
                    source[f] = defaults[f];
                }
            });
            return source;
        });
        return results;
    },

    // TODO, make our mock data available from a config boolean like:
    // USE_MOCK_DATA
    // sync: function(method, collection, options) {

    //     let deferred = $.Deferred();

    //     setTimeout(() => {
    //         collection.reset(allocationSources.map(item => new AllocationSource(item)));
    //         deferred.resolve(collection);
    //     }, 50);

    //     return deferred;
    // }
});
