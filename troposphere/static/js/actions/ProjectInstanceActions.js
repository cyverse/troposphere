define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/ProjectConstants',
    'constants/ProjectInstanceConstants',
    'stores/helpers/ProjectInstance'
  ],
  function (React, AppDispatcher, ProjectConstants, ProjectInstanceConstants, ProjectInstance) {

    var _isParanoid = false;

    return {

      dispatch: function(actionType, payload, options){
        options = options || {};
        AppDispatcher.handleRouteAction({
          actionType: actionType,
          payload: payload,
          options: options
        });
      },

      // ----------------------------
      // Add/Remove Project Resources
      // ----------------------------

      addInstanceToProject: function(instance, project, options){
        var that = this;

        var projectInstance = new ProjectInstance({
          instance: instance,
          project: project
        });

        this.dispatch(ProjectInstanceConstants.ADD_INSTANCE_TO_PROJECT, {
          instance: instance,
          project: project
        }, options);

        projectInstance.save().done(function(){
          // re-fetch the project to make sure the change was also made on the server
          if(_isParanoid) {
            project.fetch().then(function () {
              that.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
            });
          }
        }).fail(function(){
          that.dispatch(ProjectInstanceConstants.REMOVE_INSTANCE_FROM_PROJECT, {
            instance: instance,
            project: project
          });
        });
      },

      removeInstanceFromProject: function(instance, project, options){
        var that = this;

        var projectInstance = new ProjectInstance({
          instance: instance,
          project: project
        });

        this.dispatch(ProjectInstanceConstants.REMOVE_INSTANCE_FROM_PROJECT, {
          instance: instance,
          project: project
        }, options);

        projectInstance.destroy().done(function(){
          // re-fetch the project to make sure the change was also made on the server
          if(_isParanoid) {
            project.fetch().then(function () {
              that.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
            });
          }
        }).fail(function(){
          that.dispatch(ProjectInstanceConstants.ADD_INSTANCE_TO_PROJECT, {
            instance: instance,
            project: project
          });
        });
      }

    };

  });
