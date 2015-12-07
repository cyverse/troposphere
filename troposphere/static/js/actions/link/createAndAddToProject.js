define(function (require) {
  'use strict';

  var ExternalLinkConstants = require('constants/ExternalLinkConstants'),
    ExternalLink = require('models/ExternalLink'),
    actions = require('actions'),
    Utils = require('../Utils');

  return {

    createAndAddToProject: function (payload) {

      if (!payload.title) throw new Error("Missing title");
      if (!payload.description) throw new Error("Missing description");
      if (!payload.link) throw new Error("Missing link");
      if (!payload.project) throw new Error("Missing project");

      var title = payload.title,
        project = payload.project,
        link = payload.link,
        description = payload.description;

      var external_link = new ExternalLink({
        title: title,
        link: link,
        description: description
      });

      // Add the external_link optimistically
      Utils.dispatch(ExternalLinkConstants.ADD_LINK, {link: external_link}, {silent: false});

      external_link.save().done(function () {
        debugger;
        Utils.dispatch(ExternalLinkConstants.UPDATE_LINK, {link: external_link}, {silent: false});
        Utils.dispatch(ExternalLinkConstants.REMOVE_PENDING_LINK_FROM_PROJECT, {link: external_link, project: project});
        actions.ProjectExternalLinkActions.addExternalLinkToProject({
          project: project,
          link: external_link
        });
      }).fail(function (response) {
        debugger;
        Utils.dispatch(ExternalLinkConstants.REMOVE_LINK, {link: external_link}, {silent: false});
        Utils.dispatch(ExternalLinkConstants.REMOVE_PENDING_LINK_FROM_PROJECT, {link: external_link, project: project});
        Utils.displayError({title: "ExternalLink could not be created", response: response});
      });

      Utils.dispatch(ExternalLinkConstants.ADD_PENDING_LINK_TO_PROJECT, {link: external_link, project: project});

    }

  };

});
