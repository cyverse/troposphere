define(
  [
    'underscore',
    'dispatchers/dispatcher',
    'stores/store',
    'rsvp',
    'collections/projects',
    'actions/projects'
  ],
  function (_, Dispatcher, Store, RSVP, Projects, ProjectActions) {

    var _projects = null;
    var _isFetching = false;

    var fetchProjects = function () {
      _isFetching = true;
      return new RSVP.Promise(function (resolve, reject) {
        var projects = new Projects();
        projects.fetch().done(function () {
          _isFetching = false;
          _projects = projects;
          resolve();
        });
      });
    }

    function create(project){
      _projects.add(project);
    }

    var ProjectsStore = {

      getAll: function () {
        if(!_projects) {
          fetchProjects().done(function(){
            this.emitChange();
          }.bind(this));
        }
        return _projects;
      }

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        case ProjectConstants.PROJECT_CREATE:
          ApplicationStore.fetchAll();
          break;

        default:
          return true;
      }

      this.emitChange();

      return true;
    });

    _.extend(ProjectsStore, Store);

    return ProjectsStore;
  });
