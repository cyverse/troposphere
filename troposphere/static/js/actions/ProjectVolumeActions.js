define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      ProjectConstants = require('constants/ProjectConstants'),
      ProjectVolumeConstants = require('constants/ProjectVolumeConstants'),
      ProjectVolume = require('models/ProjectVolume'),
      Utils = require('./Utils'),
      stores = require('stores');

  var _isParanoid = false;

  return {

    // -------------------------
    // Add/Remove Project Volume
    // -------------------------

    addVolumeToProject: function(volume, project, options){
      var projectVolume = new ProjectVolume(),
          data = {
            project: project.id,
            volume: volume.id
          };

      projectVolume.save(null, {attrs: data}).done(function(){
        Utils.dispatch(ProjectVolumeConstants.ADD_PROJECT_VOLUME, {projectVolume: projectVolume}, options);
      })
    },

    removeVolumeFromProject: function(volume, project, options){
      var projectVolume = stores.ProjectVolumeStore.getProjectVolumeFor(project, volume);

      projectVolume.destroy().done(function(){
        Utils.dispatch(ProjectVolumeConstants.REMOVE_PROJECT_VOLUME, {projectVolume: projectVolume}, options);
      });
    }

  };

});
