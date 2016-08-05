import backbone from 'backbone';
import AllocationSource from 'models/AllocationSource';
import globals from 'globals';
import $ from 'jquery';

import allocationSources from 'mockdata/allocationSources.json';

export default backbone.Collection.extend({
    model: AllocationSource,

    url: globals.API_V2_ROOT + "/allocation_sources",

    parse: function (response) {
        return response.results;
    },

    /*Uncomment this block if you do not have access to TAS API
     sync: function(method, collection, options) {

        let deferred = $.Deferred();

        setTimeout(() => {
            collection.reset(allocationSources.map(item => new AllocationSource(item)));
            deferred.resolve(collection);
        }, 50);

        return deferred;
    }
    */
});
