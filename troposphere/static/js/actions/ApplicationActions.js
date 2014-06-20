define(
  [
    'dispatchers/AppDispatcher',
    'constants/ApplicationConstants'
  ],
  function (AppDispatcher, ApplicationConstants) {

    var ApplicationActions = {

      toggleFavorited: function (application) {
        AppDispatcher.handleRouteAction({
          actionType: ApplicationConstants.APPLICATION_TOGGLE_FAVORITED,
          application: application
        });
      }
    };

    return ApplicationActions;
  });
