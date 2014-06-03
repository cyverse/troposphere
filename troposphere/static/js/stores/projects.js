define(
  [
    'underscore',
    'dispatchers/dispatcher',
    'stores/store',
    'rsvp',
    'collections/projects',
    'constants/ProjectConstants'
  ],
  function (_, Dispatcher, Store, RSVP, Projects, ProjectConstants) {

    var _projects = null;
    var _isFetching = false;

    var fetchProjects = function () {
      _isFetching = true;
      var promise = new RSVP.Promise(function (resolve, reject) {
        var projects = new Projects();
        projects.fetch().done(function () {
          _isFetching = false;
          _projects = projects;
          resolve();
        });
      });
      return promise;
    };

    function create(project){
      _projects.add(project);
    }

    var ProjectStore = {

      getAll: function () {
        if(!_projects) {
          fetchProjects().then(function(){
            ProjectStore.emitChange();
          }.bind(this));
        }
        return _projects;
      }

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        case ProjectConstants.PROJECT_CREATE:
          create(action.model);
          break;

        default:
          return true;
      }

      ProjectStore.emitChange();

      return true;
    });

    _.extend(ProjectStore, Store);

    return ProjectStore;
  });
