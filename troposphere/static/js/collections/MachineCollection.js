define(
  [
    'collections/Base',
    'models/machine'
  ],
  function (Base, Machine) {

    return Base.extend({
      model: Machine
    });

  });
