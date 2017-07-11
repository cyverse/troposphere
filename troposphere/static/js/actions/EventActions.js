import EventConstants from "constants/EventConstants";
import Events from "events";


export default {
    fire(name, payload) {
        let { allocationSource, instance } = payload;
        switch (name) {
            case EventConstants.ALLOCATION_SOURCE_CHANGE:
                return new Events.AllocationSourceChange({
                    name,
                    entity_id: allocationSource.get("name"),
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
