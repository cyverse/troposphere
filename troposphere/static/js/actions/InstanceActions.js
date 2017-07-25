import IResume from "./instance/resume";
import ISuspend from "./instance/suspend";
import IStop from "./instance/stop";
import IStart from "./instance/start";
import IReboot from "./instance/reboot";
import IRedeploy from "./instance/redeploy";
import IPoll from "./instance/poll";
import ILaunch from "./instance/launch";
import IDestroy from "./instance/destroy";
import IUpdate from "./instance/update";
import IReport from "./instance/report";
import IRequest from "./instance/requestImage";
import updateAllocationSource from "./instance/updateAllocationSource";

import { shelve } from "./instance/shelve";
import { unshelve } from "./instance/unshelve";


export default {
    resume: IResume.resume,
    suspend: ISuspend.suspend,
    stop: IStop.stop,
    start: IStart.start,
    reboot: IReboot.reboot,
    redeploy: IRedeploy.redeploy,
    poll: IPoll.poll,
    launch: ILaunch.launch,
    createProjectAndLaunchInstance: ILaunch.createProjectAndLaunchInstance,
    destroy: IDestroy.destroy,
    update: IUpdate.update,
    report: IReport.report,
    requestImage: IRequest.requestImage,
    shelve,
    unshelve,
    updateAllocationSource
};
