import Update from "./volume/update";
import Report from "./volume/report";
import Poll from "./volume/poll";
import Create from "./volume/create";
import Destroy from "./volume/destroy";


export default {
    update: Update.update,
    report: Report.report,
    poll: Poll.poll,
    createAndAddToProject: Create.createV1,
    createV2: Create.createV2,
    destroy: Destroy.destroy
};
