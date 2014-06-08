define(
  [
    'collections/Base',
    'models/Machine'
  ],
  function (Base, Machine) {

    return Base.extend({
      model: Machine
    });

  });
