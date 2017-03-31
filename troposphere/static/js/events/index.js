import Backbone from "backbone";

import globals from "globals";
import EventConstants from "constants/EventConstants";

let Event = Backbone.Model.extend({
    url: globals.API_V2_ROOT + "/events",
    validate(attrs, options) {
        throw "Events require validation, override validate";
    }
})

export const AllocationSourceChange = Event.extend({
    validate(attrs, options) {
        if (!options.validate) {
            return;
        }
        if (!attrs) {
            throw "No data to validate";
        }

        let { entity_id, name, payload } = attrs;
        if (entity_id == undefined) {
            throw "Incorrect field: entity_id";
        }
        if (name != EventConstants.ALLOCATION_SOURCE_CHANGE) {
            throw `Invalid event name -- Expected '${EventConstants.ALLOCATION_SOURCE_CHANGE}'`;
        }
        if (!payload) {
            throw "Missing payload";
        }
        let { allocation_source_name, instance_id } = payload;
        if (allocation_source_name == undefined || instance_id == undefined) {
            throw "Invalid attrs.payload -- Expected keys: 'instance_id' and 'allocation_source_name'";
        }
    }
});

export default {
    AllocationSourceChange,
}
