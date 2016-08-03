import backbone from 'backbone';
import AllocationSource from 'models/AllocationSource';
import globals from 'globals';

import allocationSourceList from 'mockdata/allocationSource';

export default backbone.Collection.extend({
    model: AllocationSource,

    url: globals.API_V2_ROOT + "/allocation_source",

    parse: function (response) {
        return response.results;
    },

    sync: function(method, collection, options) {	
        return {
            done: function(cb) {
                collection.reset(allocationSourceList.map(
                    item => new AllocationSource(item)
                ))
                cb();
            }
        }
    }
});
