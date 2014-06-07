define(
  [
    'dispatchers/AppDispatcher'
  ],
  function (AppDispatcher) {

    var SizeActions = {
      constants: {
        fetch: 'size_fetch'
      },
      fetch: function (providerId, identityId) {
        AppDispatcher.handleRouteAction({
          actionType: this.constants.fetch,
          providerId: providerId,
          identityId: identityId
        });
      }
    };

    return SizeActions;
  });
