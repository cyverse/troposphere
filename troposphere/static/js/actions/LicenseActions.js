define(function (require) {
  "use strict";

  return {
    create: require('./license/create').create,
    create_AddToInstance: require('./license/create_AddToImageVersion').create_AddToInstance
  };

});
