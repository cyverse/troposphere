define(function (require) {

  return {
    createAndAddToProject: require('./volume/createAndAddToProject').createAndAddToProject,
    destroy: require('./volume/destroy').destroy,
    report: require('./volume/report').report
  };

});
