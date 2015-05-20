define(function (require) {

  return {
    create: require('./project/create').create,
    destroy: require('./project/destroy').destroy,
    explainProjectDeleteConditions: require('./project/explainProjectDeleteConditions').explainProjectDeleteConditions
  };

});
