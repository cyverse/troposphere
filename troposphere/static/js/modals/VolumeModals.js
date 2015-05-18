define(function (require) {

  return {
    destroy: require('./volume/destroy').destroy,
    report: require('./volume/report').report
  };

});
