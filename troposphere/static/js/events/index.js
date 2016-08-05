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
        console.warn("Implement meee: AllocationSourceChange:validate");
    }
});

export default {
    AllocationSourceChange,
}
