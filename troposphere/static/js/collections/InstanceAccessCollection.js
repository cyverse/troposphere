import InstanceCollection from "./InstanceCollection";
import InstanceAccess from "models/InstanceAccess";
import globals from "globals";

export default InstanceCollection.extend({
    model: InstanceAccess,

    url: globals.API_V2_ROOT + "/instance_access",

    parse: function(response) {
        this.meta = {
            count: response.count,
            next: response.next,
            previous: response.previous
        };

        return response.results;
    }

});
