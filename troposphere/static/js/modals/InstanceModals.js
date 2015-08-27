define(function (require) {

  return {
    createAndAddToProject: require('./instance/createAndAddToProject').createAndAddToProject,
    destroy: require('./instance/destroy').destroy,
    launch: require('./instance/launch').launch,
    reboot: require('./instance/reboot').reboot,
    redeploy: require('./instance/redeploy').redeploy,
    report: require('./instance/report').report,
    requestImage: require('./instance/requestImage').requestImage,
    resume: require('./instance/resume').resume,
    start: require('./instance/start').start,
    stop: require('./instance/stop').stop,
    suspend: require('./instance/suspend').suspend
  };

});
