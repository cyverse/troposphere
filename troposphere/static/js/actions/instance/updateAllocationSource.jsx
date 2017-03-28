import Utils from "../Utils";
import InstanceConstants from "constants/InstanceConstants";

export default function updateAllocationSource(params) {
    if (!params.instance)
        throw new Error("Missing instance");
    if (!params.allocationSource)
        throw new Error("Missing allocation source");

    let { instance, allocationSource } = params;

    instance.save({"allocation_source": allocationSource}, { patch: true });
    Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
        instance: instance
    });
}
