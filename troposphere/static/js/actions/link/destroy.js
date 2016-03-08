define(function (require) {

  var ExternalLinkConstants = require('constants/ExternalLinkConstants'),
    stores = require('stores'),
    Utils = require('../Utils'),
    globals = require('globals'),
    ProjectExternalLinkActions = require('../ProjectExternalLinkActions'),
    ExternalLinkConstants = require('constants/ExternalLinkConstants');

  return {

    destroy: function (payload, options) {
      if (!payload.link) throw new Error("Missing link");
      if (payload.project) {
          //Remove the project from the link if included in destroy
          ProjectExternalLinkActions.removeExternalLinkFromProject({
              project: payload.project,
              external_link: payload.link
          });
      }
      var external_link = payload.link;
      Utils.dispatch(ExternalLinkConstants.REMOVE_LINK, {link: external_link});

      external_link.destroy().done(function () {
        //NotificationController.success(null, "ExternalLink " + external_link.get('title') + " deleted.");
      }).fail(function () {
        var failureMessage = "Error deleting ExternalLink " + external_link.get('title') + ".";
        NotificationController.error(failureMessage);
        Utils.dispatch(ExternalLinkConstants.ADD_LINK, {link: external_link});
      });
    },

    destroy_noModal: function (payload, options) {
      this.destroy(payload, options);
    }
  };

});
