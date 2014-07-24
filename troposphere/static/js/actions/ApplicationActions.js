define(
  [
    'dispatchers/AppDispatcher',
    'constants/ApplicationConstants'
  ],
  function (AppDispatcher, ApplicationConstants) {

    return {
      updateApplicationAttributes: function (application, newAttributes) {
        application.set(newAttributes);
        AppDispatcher.handleRouteAction({
          actionType: ApplicationConstants.APPLICATION_UPDATE,
          application: application
        });
      },

      toggleFavorited: function (application) {
        AppDispatcher.handleRouteAction({
          actionType: ApplicationConstants.APPLICATION_TOGGLE_FAVORITED,
          application: application
        });
      }
    };

  });
