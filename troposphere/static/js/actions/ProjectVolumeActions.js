define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/ProjectConstants',
    'constants/ProjectVolumeConstants',
    'stores/helpers/ProjectVolume'
  ],
  function (React, AppDispatcher, ProjectConstants, ProjectVolumeConstants, ProjectVolume) {

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

      // -------------------------
      // Add/Remove Project Volume
      // -------------------------

      addVolumeToProject: function(volume, project, options){
        var that = this;

        var projectVolume = new ProjectVolume({
          volume: volume,
          project: project
        });

        this.dispatch(ProjectVolumeConstants.ADD_VOLUME_TO_PROJECT, {
          volume: volume,
          project: project
        }, options);

        projectVolume.save().done(function(){
          // re-fetch the project to make sure the change was also made on the server
          if(_isParanoid) {
            project.fetch().then(function () {
              that.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
            });
          }
        }).fail(function(){
          that.dispatch(ProjectVolumeConstants.REMOVE_VOLUME_FROM_PROJECT, {
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

        this.dispatch(ProjectVolumeConstants.REMOVE_VOLUME_FROM_PROJECT, {
          volume: volume,
          project: project
        }, options);

        projectVolume.destroy().done(function(){
          // re-fetch the project to make sure the change was also made on the server
          if(_isParanoid) {
            project.fetch().then(function () {
              that.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
            });
          }
        }).fail(function(){
          that.dispatch(ProjectVolumeConstants.ADD_VOLUME_TO_PROJECT, {
            volume: volume,
            project: project
          });
        });
      }

    };

  });
