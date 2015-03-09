define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      ProjectConstants = require('constants/ProjectConstants'),
      ProjectInstanceConstants = require('constants/ProjectInstanceConstants'),
      ProjectInstance = require('models/ProjectInstance'),
      Utils = require('./Utils'),
      stores = require('stores');

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
        Utils.dispatch(ProjectInstanceConstants.ADD_PROJECT_INSTANCE, {projectInstance: projectInstance}, options);
      });
    },

    removeInstanceFromProject: function(instance, project, options){
      var projectInstance = stores.ProjectInstanceStore.getProjectInstanceFor(project, instance);

      projectInstance.destroy().done(function(){
        Utils.dispatch(ProjectInstanceConstants.REMOVE_PROJECT_INSTANCE, {projectInstance: projectInstance}, options);
      });
    }

  };

});
