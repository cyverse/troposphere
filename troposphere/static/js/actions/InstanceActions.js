define(function (require) {
  "use strict";

  return {
    resume: require('./instance/resume').resume,
    suspend: require('./instance/suspend').suspend
  };

});
