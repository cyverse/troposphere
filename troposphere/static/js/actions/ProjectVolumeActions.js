define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/ProjectConstants',
    'constants/ProjectVolumeConstants',
    'stores/helpers/ProjectVolume',
    './Utils'
  ],
  function (React, AppDispatcher, ProjectConstants, ProjectVolumeConstants, ProjectVolume, Utils) {

    var _isParanoid = false;

    return {

      // -------------------------
      // Add/Remove Project Volume
      // -------------------------

      addVolumeToProject: function(volume, project, options){
        var that = this;

        var projectVolume = new ProjectVolume({
          volume: volume,
          project: project
        });

        Utils.dispatch(ProjectVolumeConstants.ADD_VOLUME_TO_PROJECT, {
          volume: volume,
          project: project
        }, options);

        projectVolume.save().done(function(){
          // re-fetch the project to make sure the change was also made on the server
          if(_isParanoid) {
            project.fetch().then(function () {
              Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
            });
          }
        }).fail(function(){
          Utils.dispatch(ProjectVolumeConstants.REMOVE_VOLUME_FROM_PROJECT, {
            volume: volume,
            project: project
          });
        });
      },

      removeVolumeFromProject: function(volume, project, options){
        var that = this;

        var projectVolume = new ProjectVolume({
          volume: volume,
          project: project
        });

        Utils.dispatch(ProjectVolumeConstants.REMOVE_VOLUME_FROM_PROJECT, {
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
          //Utils.dispatch(ProjectVolumeConstants.ADD_VOLUME_TO_PROJECT, {
          //  volume: volume,
          //  project: project
          //});
        });
      }

    };

  });
