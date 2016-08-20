import EventConstants from "constants/EventConstants";
import Events from "events";


export default {
    fire(name, payload) {
        switch (name) {
            case EventConstants.ALLOCATION_SOURCE_CHANGE:
                let { allocationSource, instance } = payload
                return new Events.AllocationSourceChange({
                    name,
                    entity_id: instance.get("uuid"),
                    payload: {
                        allocation_source_id: allocationSource.get("source_id"),
                        instance_id: instance.get("uuid")
                    }
                }).save();
            default:
                throw `Event of type: ${type} is not handled.`
        }
    }
}
