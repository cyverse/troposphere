import { Model } from 'backbone';

import EventTypes from "constants/EventConstants";
import Events from "events";


export default {
    fire(name, payload) {
        switch (name) {
            case EventTypes.ALLOCATION_SOURCE_CHANGE:
                return new Events.AllocationSourceChange({
                    name,
                    payload,
                }).save();
            default:
                throw `Event of type: ${type} is not handled.`
        }
    }
}
