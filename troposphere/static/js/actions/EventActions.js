import { Model } from 'backbone';

import EventTypes from "constants/EventConstants";
import Events from "events";


export default {
    fire(name, filter_id, payload) {
        switch (name) {
            case EventTypes.ALLOCATION_SOURCE_CHANGE:
                return new Events.AllocationSourceChange({
                    name,
                    filter_id,
                    payload,
                }).save();
            default:
                throw `Event of type: ${type} is not handled.`
        }
    }
}
