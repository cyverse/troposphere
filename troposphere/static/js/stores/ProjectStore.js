define(function (require) {

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Store = require('stores/Store'),
      ProjectCollection = require('collections/ProjectCollection'),
      ProjectConstants = require('constants/ProjectConstants');

  var _projects = null;
  var _isFetching = false;

  //
  // CRUD Operations
  //

  var fetchProjects = function () {
    if(!_projects && !_isFetching) {
      _isFetching = true;
      var projects = new ProjectCollection();
      projects.fetch().done(function () {
        _isFetching = false;
        _projects = projects;
        ProjectStore.emitChange();
      });
    }
  };

  function add(project){
    _projects.add(project);
  }

  function update(project){
    var existingModel = _projects.get(project);
    if(!existingModel) throw new Error("Project doesn't exist.");
    _projects.add(project, {merge: true});
  }

  function remove(project){
    _projects.remove(project);
  }

  //
  // Project Store
  //

  var ProjectStore = {

    get: function (projectId) {
      if(!_projects) {
        fetchProjects();
      } else {
        return _projects.get(projectId);
      }
    },

    getAll: function () {
      if(!_projects) {
        fetchProjects()
      }
      return _projects;
    }

  };

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case ProjectConstants.ADD_PROJECT:
        add(payload.project);
        break;

      case ProjectConstants.UPDATE_PROJECT:
        update(payload.project);
        break;

      case ProjectConstants.REMOVE_PROJECT:
        remove(payload.project);
        break;

      case ProjectConstants.EMIT_CHANGE:
        break;

      default:
        return true;
    }

    if(!options.silent) {
      ProjectStore.emitChange();
    }

    return true;
  });

  _.extend(ProjectStore, Store);

  return ProjectStore;
});
