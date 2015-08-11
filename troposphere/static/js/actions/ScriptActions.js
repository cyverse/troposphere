define(function (require) {
  "use strict";

  return {
    create: require('./script/create').create,
    create_AddToImageVersion: require('./script/create_AddToImageVersion').create_AddToImageVersion
  };

});
