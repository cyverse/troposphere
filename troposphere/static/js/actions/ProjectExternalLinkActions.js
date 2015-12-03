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

    addExternalLinkToProject: function (params, options) {
      if (!params.project) throw new Error("Missing project");
      if (!params.external_link && !params.external_link.id) throw new Error("Missing external_link");

      var project = params.project,
        external_link = params.external_link,
        projectExternalLink = new ProjectExternalLink(),
        data = {
          project: project.id,
          external_link: external_link.id
        };

      projectExternalLink.save(null, {attrs: data}).done(function () {
        Utils.dispatch(ProjectExternalLinkConstants.ADD_PROJECT_EXTERNAL_LINK, {projectExternalLink: projectExternalLink}, options);
      })
    },

    removeExternalLinkFromProject: function (params, options) {
      if (!params.project) throw new Error("Missing project");
      if (!params.external_link) throw new Error("Missing external_link");

      var project = params.project,
        external_link = params.external_link,
        projectExternalLink = stores.ProjectExternalLinkStore.findOne({
          'project.id': project.id,
          'external_link.id': external_link.id
        });

      projectExternalLink.destroy().done(function () {
        Utils.dispatch(ProjectExternalLinkConstants.REMOVE_PROJECT_EXTERNAL_LINK, {projectExternalLink: projectExternalLink}, options);
      });
    }

  };

});
