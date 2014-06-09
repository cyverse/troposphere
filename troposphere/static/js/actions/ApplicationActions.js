define(
  [
    'dispatchers/AppDispatcher',
    'constants/ApplicationConstants'
  ],
  function (AppDispatcher, ApplicationConstants) {

    var ApplicationActions = {
      constants: {
        fetchDetail: 'application_fetch_detail',
        search: 'application_search'
      },

      fetch: function (appId) {
        AppDispatcher.handleRouteAction({
          actionType: this.constants.fetchDetail,
          id: appId
        });
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
