define(function (require) {

  return {
    reportVolume: require('./volume/report').report,
    poll: require('./volume/poll').poll,
    createAndAddToProject: require('./volume/createAndAddToProject'),
    destroy: require('./volume/destroy').destroy,
    destroy_noModal: require('./volume/destroy').destroy_noModal
  };

});
