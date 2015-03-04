define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/ProjectConstants',
    'constants/ProjectInstanceConstants',
    'stores/helpers/ProjectInstance',
    './Utils'
  ],
  function (React, AppDispatcher, ProjectConstants, ProjectInstanceConstants, ProjectInstance, Utils) {

    var _isParanoid = false;

    return {

      // ----------------------------
      // Add/Remove Project Resources
      // ----------------------------

      addInstanceToProject: function(instance, project, options){
        var that = this;

        var projectInstance = new ProjectInstance({
          instance: instance,
          project: project
        });

        Utils.dispatch(ProjectInstanceConstants.ADD_INSTANCE_TO_PROJECT, {
          instance: instance,
          project: project
        }, options);

        projectInstance.save().done(function(){
          // re-fetch the project to make sure the change was also made on the server
          if(_isParanoid) {
            project.fetch().then(function () {
              Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
            });
          }
        }).fail(function(){
          Utils.dispatch(ProjectInstanceConstants.REMOVE_INSTANCE_FROM_PROJECT, {
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

        Utils.dispatch(ProjectInstanceConstants.REMOVE_INSTANCE_FROM_PROJECT, {
          instance: instance,
          project: project
        }, options);

        projectInstance.destroy().done(function(){
          // re-fetch the project to make sure the change was also made on the server
          if(_isParanoid) {
            project.fetch().then(function () {
              Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
            });
          }
        }).fail(function(){
          var warning = "API says instance wasn't removed from project, but is likely " +
                        "lying. False false bug. This message is here until PAG is over.";
          console.warn(warning);

          //Utils.dispatch(ProjectInstanceConstants.ADD_INSTANCE_TO_PROJECT, {
          //  instance: instance,
          //  project: project
          //});
        });
      }

    };

  });
