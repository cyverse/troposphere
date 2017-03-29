import EventConstants from "constants/EventConstants";
import Events from "events";


export default {
    fire(name, payload) {
        switch (name) {
            case EventConstants.ALLOCATION_SOURCE_CHANGE:
                let { allocationSource, instance } = payload
                return new Events.AllocationSourceChange({
                    name,
                    entity_id: instance.get("user").username,
                    payload: {
                        allocation_source_name: allocationSource.get("name"),
                        instance_id: instance.get("uuid")
                    }
                }).save();
            default:
                throw `Event of type: ${name} is not handled.`
        }
    }
}
