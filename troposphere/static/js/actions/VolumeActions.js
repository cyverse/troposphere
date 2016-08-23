import Update from './volume/update';
import Report from './volume/report';
import Poll from './volume/poll';
import Create from './volume/createAndAddToProject';
import Destroy from './volume/destroy';


export default {
    update: Update.update,
    report: Report.report,
    poll: Poll.poll,
    createAndAddToProject: Create.createAndAddToProject,
    destroy: Destroy.destroy,
};
