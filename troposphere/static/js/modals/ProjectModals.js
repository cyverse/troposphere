define(function (require) {

  return {
    addImage: require('./project/addImage').addImage,
    create: require('./project/create').create,
    destroy: require('./project/destroy').destroy,
    explainProjectDeleteConditions: require('./project/explainProjectDeleteConditions').explainProjectDeleteConditions,
    cantMoveAttached: require('./project/cantMoveAttached').cantMoveAttached,
    moveResources: require('./project/moveResources').moveResources,
    removeResources: require('./project/removeResources').removeResources
  };

});
