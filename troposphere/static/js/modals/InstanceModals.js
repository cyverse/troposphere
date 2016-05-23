import ICreateModal from './instance/createAndAddToProject';
import IDestroyModal from './instance/destroy';
import ILaunchModal from './instance/launch';
import IRebootModal from './instance/reboot';
import IRedeployModal from './instance/redeploy';
import IReportModal from './instance/report';
import IRequestImageModal from './instance/requestImage';
import IResumeModal from './instance/resume';
import IStartModal from './instance/start';
import IStopModal from './instance/stop';
import ISuspendModal from './instance/suspend';


export default {
    createAndAddToProject: ICreateModal.createAndAddToProject,
    destroy: IDestroyModal.destroy,
    launch: ILaunchModal.launch,
    reboot: IRebootModal.reboot,
    redeploy: IRedeployModal.redeploy,
    report: IReportModal.report,
    requestImage: IRequestImageModal.requestImage,
    resume: IResumeModal.resume,
    start: IStartModal.start,
    stop: IStopModal.stop,
    suspend: ISuspendModal.suspend
};
