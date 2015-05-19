define(function (require) {

  return {
    createAndAddToProject: require('./instance/createAndAddToProject').createAndAddToProject,
    destroy: require('./instance/destroy').destroy,
    launch: require('./instance/launch').launch,
    reboot: require('./instance/reboot').reboot
  };

});
