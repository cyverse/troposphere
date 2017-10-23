import InstanceCollection from "./InstanceCollection";
import InstancePlaybook from "models/InstancePlaybook";
import globals from "globals";

export default InstanceCollection.extend({
    model: InstancePlaybook,

    url: globals.API_V2_ROOT + "/instance_playbooks",

    parse: function(response) {
        this.meta = {
            count: response.count,
            next: response.next,
            previous: response.previous
        };

        return response.results;
    }

});
