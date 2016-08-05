import { assert } from "chai";
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
        console.log("No validation yet");
        // [payload, payload.instance, payload.allocationSource].forEach(assert.isDefined);
        //                 allocation_source_id: source.get('source_id'),
        //                instance_id: instance.get("uuid")
    }
});

export default {
    AllocationSourceChange,
}
