define(function (require) {
  "use strict";

  return {
    resume: require('./instance/resume').resume,
    suspend: require('./instance/suspend').suspend,
    stop: require('./instance/stop').stop,
    start: require('./instance/start').start,
    reboot: require('./instance/reboot').reboot,
    redeploy: require('./instance/redeploy').redeploy,
    poll: require('./instance/poll').poll,
    initiatePush: require('./instance/push').initiatePush,
    launch: require('./instance/launch').launch,
    createProjectAndLaunchInstance: require('./instance/launch').createProjectAndLaunchInstance,
    destroy: require('./instance/destroy').destroy,
    pushUpdate: require('./instance/update').pushUpdate,
    setName: require('./instance/update').setName,
    report: require('./instance/report').report,
    requestImage: require('./instance/requestImage').requestImage
  };

});
