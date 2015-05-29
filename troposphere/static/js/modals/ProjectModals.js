define(function (require) {

  return {
    create: require('./project/create').create,
    destroy: require('./project/destroy').destroy,
    explainProjectDeleteConditions: require('./project/explainProjectDeleteConditions').explainProjectDeleteConditions,
    moveResources: require('./project/moveResources').moveResources,
    removeResources: require('./project/removeResources').removeResources
  };

});
