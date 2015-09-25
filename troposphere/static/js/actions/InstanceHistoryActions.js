define(function (require) {
  "use strict";

  var Utils = require('./Utils'),
      Constants = require('constants/InstanceHistoryConstants');

  return {
      add: function(){
        var request = params.request,
        response = params.response,
        quota = params.quota,
        allocation = params.allocation,
        status = params.status;

      var newAttributes = {
        admin_message: response,
        quota: quota,
        allocation: allocation,
        status: status
      };

      request.set(newAttributes);
      Router.getInstance().transitionTo("admin");
      request.save(newAttributes, {patch: true}).done(function () {
        Utils.dispatch(Constants.UPDATE, {model: request});
        Utils.dispatch(Constants.REMOVE, {model: request});
      });
    }

      }
    //resume: require('./instance/resume').resume,
    //suspend: require('./instance/suspend').suspend,
    // stop: require('./instance/stop').stop,
    // start: require('./instance/start').start,
    // reboot: require('./instance/reboot').reboot,
    // redeploy: require('./instance/redeploy').redeploy,
    // poll: require('./instance/poll').poll,
    // launch: require('./instance/launch').launch,
    // createProjectAndLaunchInstance: require('./instance/launch').createProjectAndLaunchInstance,
    // destroy: require('./instance/destroy').destroy,
    // update: require('./instance/update').update,
    // report: require('./instance/report').report,
    // requestImage: require('./instance/requestImage').requestImage
  };

});
