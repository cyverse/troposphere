import Backbone from "backbone";
import AdminResourceRequest from "models/AdminResourceRequest";
import globals from "globals";

export default Backbone.Collection.extend({
    model: AdminResourceRequest,

    url: globals.API_V2_ROOT + "/admin/resource_requests",

    parse: function(response) {
        this.meta = {
            count: response.count,
            next: response.next,
            previous: response.previous
        };
        return response.results;
    }

});
