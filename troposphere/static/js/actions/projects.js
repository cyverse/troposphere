define(
  [
    'dispatchers/app_dispatcher',
    'constants/ProjectConstants'
  ],
  function (AppDispatcher, ProjectConstants) {

    return {
      create: function (project) {
        AppDispatcher.handleRouteAction({
          actionType: ProjectConstants.PROJECT_CREATE,
          model: project
        });
      }
    };

  });
