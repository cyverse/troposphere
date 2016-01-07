define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
    ProjectConstants = require('constants/ProjectConstants'),
    ProjectExternalLinkConstants = require('constants/ProjectExternalLinkConstants'),
    ProjectExternalLink = require('models/ProjectExternalLink'),
    Utils = require('./Utils'),
    stores = require('stores');

  return {

    // -------------------------
    // Add/Remove Project ExternalLink
    // -------------------------

    addExternalLinkToProject: function (payload, options) {
      if (!payload.project) throw new Error("Missing project");
      if (!payload.link && !payload.link.id) throw new Error("Missing link");

      var project = payload.project,
        external_link = payload.link,
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
      if (!payload.link) throw new Error("Missing link");

      var project = payload.project,
        external_link = payload.link,
        projectExternalLink = stores.ProjectExternalLinkStore.findOne({
          'project.id': project.id,
          'external_link.id': external_link.id
        });

      projectExternalLink.destroy().done(function () {
        Utils.dispatch(ProjectExternalLinkConstants.REMOVE_PROJECT_LINK, {projectExternalLink: projectExternalLink}, options);
      });
    }

  };

});
