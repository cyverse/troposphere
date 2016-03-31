import AppDispatcher from 'dispatchers/AppDispatcher';
import ProjectConstants from 'constants/ProjectConstants';
import ProjectExternalLinkConstants from 'constants/ProjectExternalLinkConstants';
import ProjectExternalLink from 'models/ProjectExternalLink';
import Utils from './Utils';
import stores from 'stores';

export default {

    // -------------------------
    // Add/Remove Project ExternalLink
    // -------------------------

    addExternalLinkToProject: function (payload, options) {
      if (!payload.project) throw new Error("Missing project");
      if (!payload.external_link && !payload.external_link.id) throw new Error("Missing external_link");

      var project = payload.project,
        external_link = payload.external_link,
        projectExternalLink = new ProjectExternalLink(),
        data = {
          project: project.id,
          external_link: external_link.id
        };

      projectExternalLink.save(null, {attrs: data}).done(function () {
        Utils.dispatch(ProjectExternalLinkConstants.ADD_PROJECT_LINK, {projectExternalLink: projectExternalLink}, options);
      })
    },

    removeExternalLinkFromProject: function (payload, options) {
      if (!payload.project) throw new Error("Missing project");
      if (!payload.external_link) throw new Error("Missing external_link");

      var project = payload.project,
        external_link = payload.external_link,
        projectExternalLink = stores.ProjectExternalLinkStore.findOne({
          'project.id': project.id,
          'external_link.id': external_link.id
        });

      projectExternalLink.destroy().done(function () {
        Utils.dispatch(ProjectExternalLinkConstants.REMOVE_PROJECT_LINK, {projectExternalLink: projectExternalLink}, options);
      });
    }

};
