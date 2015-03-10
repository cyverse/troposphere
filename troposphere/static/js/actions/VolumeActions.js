define(function (require) {

  return {
    update: require('./volume/update').update,
    report: require('./volume/report').report,
    poll: require('./volume/poll').poll,
    createAndAddToProject: require('./volume/createAndAddToProject').createAndAddToProject,
    destroy: require('./volume/destroy').destroy,
    destroy_noModal: require('./volume/destroy').destroy_noModal
  };

});
