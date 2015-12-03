define(function (require) {
  'use strict';

  var ExternalLinkConstants = require('constants/ExternalLinkConstants'),
    ExternalLink = require('models/ExternalLink'),
    actions = require('actions'),
    Utils = require('../Utils');

  return {

    createAndAddToProject: function (params) {

      if (!params.title) throw new Error("Missing title");
      if (!params.description) throw new Error("Missing description");
      if (!params.link) throw new Error("Missing link");
      if (!params.project) throw new Error("Missing project");

      var title = params.title,
        project = params.project,
        link = params.link,
        description = params.description;

      var external_link = new ExternalLink({
        title: title,
        link: link,
        description: description
      });

      // Add the external_link optimistically
      Utils.dispatch(ExternalLinkConstants.ADD_LINK, {external_link: external_link}, {silent: false});

      external_link.save().done(function () {
        Utils.dispatch(ExternalLinkConstants.UPDATE_LINK, {external_link: external_link}, {silent: false});
        Utils.dispatch(ExternalLinkConstants.REMOVE_PENDING_LINK_FROM_PROJECT, {external_link: external_link, project: project});
        actions.ProjectExternalLinkActions.addExternalLinkToProject({
          project: project,
          external_link: external_link
        });
      }).fail(function (response) {
        Utils.dispatch(ExternalLinkConstants.REMOVE_LINK, {external_link: external_link}, {silent: false});
        Utils.dispatch(ExternalLinkConstants.REMOVE_PENDING_LINK_FROM_PROJECT, {external_link: external_link, project: project});
        Utils.displayError({title: "ExternalLink could not be created", response: response});
      });

      Utils.dispatch(ExternalLinkConstants.ADD_PENDING_LINK_TO_PROJECT, {external_link: external_link, project: project});

    }

  };

});
