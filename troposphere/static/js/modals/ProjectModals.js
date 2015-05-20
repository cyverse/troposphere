define(function (require) {

  return {
    create: require('./project/create').create,
    destroy: require('./project/destroy').destroy
  };

});
