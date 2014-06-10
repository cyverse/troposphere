define(
  [
    'dispatchers/AppDispatcher',
    'constants/ApplicationConstants'
  ],
  function (AppDispatcher, ApplicationConstants) {

    var ApplicationActions = {
      constants: {
        search: 'application_search'
      },

      search: function (query) {
        AppDispatcher.handleRouteAction({
          actionType: this.constants.search,
          query: query
        });
      },

      toggleFavorited: function (application) {
        AppDispatcher.handleRouteAction({
          actionType: ApplicationConstants.APPLICATION_TOGGLE_FAVORITED,
          application: application
        });
      }
    };

    return ApplicationActions;
  });
