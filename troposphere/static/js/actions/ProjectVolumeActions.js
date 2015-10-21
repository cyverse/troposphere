
import AppDispatcher from 'dispatchers/AppDispatcher';
import ProjectConstants from 'constants/ProjectConstants';
import ProjectVolumeConstants from 'constants/ProjectVolumeConstants';
import ProjectVolume from 'models/ProjectVolume';
import Utils from './Utils';
import stores from 'stores';

export default {

    // -------------------------
    // Add/Remove Project Volume
    // -------------------------

    addVolumeToProject: function (params, options) {
      if (!params.project) throw new Error("Missing project");
      if (!params.volume && !params.volume.id) throw new Error("Missing volume");

      var project = params.project,
        volume = params.volume,
        projectVolume = new ProjectVolume(),
        data = {
          project: project.id,
          volume: volume.id
        };

      projectVolume.save(null, {attrs: data}).done(function () {
        Utils.dispatch(ProjectVolumeConstants.ADD_PROJECT_VOLUME, {projectVolume: projectVolume}, options);
      })
    },

    removeVolumeFromProject: function (params, options) {
      if (!params.project) throw new Error("Missing project");
      if (!params.volume) throw new Error("Missing volume");

      var project = params.project,
        volume = params.volume,
        projectVolume = stores.ProjectVolumeStore.findOne({
          'project.id': project.id,
          'volume.id': volume.id
        });

      projectVolume.destroy().done(function () {
        Utils.dispatch(ProjectVolumeConstants.REMOVE_PROJECT_VOLUME, {projectVolume: projectVolume}, options);
      });
    }

};
