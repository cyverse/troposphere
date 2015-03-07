define(function (require) {
  "use strict";

  return {
    resume: require('./instance/resume').resume,
    suspend: require('./instance/suspend').suspend,
    stop: require('./instance/stop').stop,
    start: require('./instance/start').start
  };

});
