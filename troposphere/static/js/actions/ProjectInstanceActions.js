
import AppDispatcher from 'dispatchers/AppDispatcher';
import ProjectConstants from 'constants/ProjectConstants';
import ProjectInstanceConstants from 'constants/ProjectInstanceConstants';
import ProjectInstance from 'models/ProjectInstance';
import Utils from './Utils';
import stores from 'stores';

export default {

    // ----------------------------
    // Add/Remove Project Resources
    //
    // NOTE: these methods fail on pending instances, it is sufficient for
    // moving existing instances between projects
    // ----------------------------

    addInstanceToProject: function (params, options) {
      if (!params.project) throw new Error("Missing project");
      if (!params.instance) throw new Error("Missing instance");
      if (!params.instance.id) throw new Error("Instance is pending, must possess an id");

      var project = params.project,
        instance = params.instance,
        projectInstance = new ProjectInstance(),
        data = {
          project: project.id,
          instance: instance.id
        };

      projectInstance.save(null, {attrs: data}).done(function () {
        Utils.dispatch(ProjectInstanceConstants.ADD_PROJECT_INSTANCE, {projectInstance: projectInstance}, options);
      });
    },

    removeInstanceFromProject: function (params, options) {
      if (!params.project) throw new Error("Missing project");
      if (!params.instance) throw new Error("Missing instance");
      if (!params.instance.id) throw new Error("Instance is pending, must possess an id");

      var project = params.project,
        instance = params.instance,
        projectInstance = stores.ProjectInstanceStore.findOne({
          'project.id': project.id,
          'instance.id': instance.id
        });

      projectInstance.destroy().done(function () {
        Utils.dispatch(ProjectInstanceConstants.REMOVE_PROJECT_INSTANCE, {projectInstance: projectInstance}, options);
      });
    }

  };
