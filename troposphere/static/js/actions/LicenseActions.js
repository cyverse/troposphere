define(function (require) {
  "use strict";

  return {
    create: require('./license/create').create,
    create_AddToImageVersion: require('./license/create_AddToImageVersion').create_AddToImageVersion
  };

});
