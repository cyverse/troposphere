define(function (require) {
  "use strict";

  return {
    attach: require('./instanceVolume/attach').attach,
    detach: require('./instanceVolume/detach').detach
  };

});
