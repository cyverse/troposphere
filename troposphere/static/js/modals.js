define(
  [
    // Note: while we could include all the modals here, I'm not going to
    // instead, I'm going to let the application load the modals it needs
    // to use during the bootstrapping process so that the application
    // will throw exceptions if any actions don't exist (which will be the default
    // state for functional tests that need mocked modals)
  ],
  function () {

    return {
      // add modals here
    }

  });
