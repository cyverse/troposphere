define(['dispatchers/app_dispatcher'], function(AppDispatcher) {

  var ApplicationActions = {
    constants: {
      fetchDetail: 'application_fetch_detail',
      fetchAll: 'application_fetch_all',
      search: 'application_search'
    },
    fetch: function(appId) {
      AppDispatcher.handleRouteAction({
        actionType: this.constants.fetchDetail,
        id: appId
      });
    },
    fetchAll: function() {
      AppDispatcher.handleRouteAction({
        actionType: this.constants.fetchAll
      });
    },
    search: function(query) {
      AppDispatcher.handleRouteAction({
        actionType: this.constants.search,
        query: query
      });
    }
  };

  return ApplicationActions;
});
