define(function (require) {

  return {
    create: require('./project/create').create,
    destroy: require('./project/destroy').destroy,
    explainProjectDeleteConditions: require('./project/explainProjectDeleteConditions').explainProjectDeleteConditions,
    cantMoveAttached: require('./project/cantMoveAttached').cantMoveAttached,
    moveResources: require('./project/moveResources').moveResources,
    removeResources: require('./project/removeResources').removeResources
  };

});
