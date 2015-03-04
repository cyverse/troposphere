define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      ProjectConstants = require('constants/ProjectConstants'),
      ProjectInstanceConstants = require('constants/ProjectInstanceConstants'),
      ProjectInstance = require('models/ProjectInstance'),
      Utils = require('./Utils');

  var _isParanoid = false;

  return {

    // ----------------------------
    // Add/Remove Project Resources
    // ----------------------------

    addInstanceToProject: function(instance, project, options){
      var projectInstance = new ProjectInstance(),
          data = {
            project: project.id,
            instance: instance.id
          };

      projectInstance.save(null, { attrs: data }).done(function(){
        Utils.dispatch(ProjectInstanceConstants.ADD_INSTANCE_TO_PROJECT, projectInstance, options);
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
