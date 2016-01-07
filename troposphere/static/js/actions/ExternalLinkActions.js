define(function (require) {
  "use strict";

  return {
    create: require('./link/create').create,
    createAndAddToProject: require('./link/createAndAddToProject').createAndAddToProject,
    destroy: require('./link/destroy').destroy,
    update: require('./link/update').update
  };

});
