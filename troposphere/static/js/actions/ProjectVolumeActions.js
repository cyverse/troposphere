define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      ProjectConstants = require('constants/ProjectConstants'),
      ProjectVolumeConstants = require('constants/ProjectVolumeConstants'),
      ProjectVolume = require('models/ProjectVolume'),
      Utils = require('./Utils');

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
        Utils.dispatch(ProjectVolumeConstants.ADD_PROJECT_VOLUME, projectVolume, options);
      })
    },

    removeVolumeFromProject: function(volume, project, options){
      var that = this;

      var projectVolume = new ProjectVolume({
        volume: volume,
        project: project
      });

      Utils.dispatch(ProjectVolumeConstants.REMOVE_PROJECT_VOLUME, {
        volume: volume,
        project: project
      }, options);

      projectVolume.destroy().done(function(){
        // re-fetch the project to make sure the change was also made on the server
        if(_isParanoid) {
          project.fetch().then(function () {
            Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
          });
        }
      }).fail(function(){
        var warning = "API says volume wasn't removed from project, but is likely " +
                      "lying. False false bug. This message is here until PAG is over.";
        console.warn(warning);
        //Utils.dispatch(ProjectVolumeConstants.ADD_PROJECT_VOLUME, {
        //  volume: volume,
        //  project: project
        //});
      });
    }

  };

});
