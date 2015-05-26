define(function (require) {

  return {
    attach: require('./instanceVolume/attach').attach,
    detach: require('./instanceVolume/detach').detach
  };

});
