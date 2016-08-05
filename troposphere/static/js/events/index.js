import { Model } from "backbone";

import globals from "globals";

let Event = Model.extend({
    url: globals.API_V2_ROOT + "/events",
    validate(attrs, options) {
        return "Events require validation, override validate";
    }
})

export const AllocationSourceChange = Event.extend({
    validate(attrs, options) {
        if (!options.validate) {
            return
        }
        if(!attrs) {
            return "No data to validate"
        }
        if(!attrs.filter_id) {
            return "filter_id missing"
        }
        if(!attrs.name || attrs.name !== "instance_allocation_source_changed") {
            return "Invalid event name -- Expected 'instance_allocation_source_changed'"
        }
        let payload = attrs.payload;
        if(!payload || !payload.allocation_source_id || !payload.instance_id) {
            return "Invalid event payload -- Expected keys: 'instance_id' and 'allocation_source_id'"
        }
        return
    }
});

export default {
    AllocationSourceChange,
}
