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

    addInstanceToProject: function(params, options){
      if(!params.project) throw new Error("Missing project");
      if(!params.instance) throw new Error("Missing instance");

      var project = params.project,
          instance = params.instance,
          projectInstance = new ProjectInstance(),
          data = {
            project: project.id,
            instance: instance.id
          };

      projectInstance.save(null, { attrs: data }).done(function(){
        Utils.dispatch(ProjectInstanceConstants.ADD_PROJECT_INSTANCE, {projectInstance: projectInstance}, options);
      });
    },

    removeInstanceFromProject: function(params, options){
      if(!params.project) throw new Error("Missing project");
      if(!params.instance) throw new Error("Missing instance");

      var project = params.project,
          instance = params.instance,
          projectInstance = stores.ProjectInstanceStore.findOne({
            'project.id': project.id,
            'instance.id': instance.id
          });

      projectInstance.destroy().done(function(){
        Utils.dispatch(ProjectInstanceConstants.REMOVE_PROJECT_INSTANCE, {projectInstance: projectInstance}, options);
      });
    }

  };

});
