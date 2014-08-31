define(
  [
    // dependencies go here
  ],
  function () {

    var MockStore = function () {
      return {

        //
        // Common methods
        //

        get: function () {
          return null;
        },

        getAll: function () {
          return null;
        },

        //
        // Inherited methods
        //

        addChangeListener: function (callback) { },
        removeChangeListener: function (callback) { },
        emitChange: function () { }
      }
    };

    return MockStore;

  });
