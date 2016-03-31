import stores from 'stores';
import Utils from '../Utils';
import globals from 'globals';
import ProjectExternalLinkActions from '../ProjectExternalLinkActions';
import ExternalLinkConstants from 'constants/ExternalLinkConstants';

export default {

    destroy: function (payload, options) {
      if (!payload.external_link) throw new Error("Missing external_link");
      if (payload.project) {
          //Remove the project from the link if included in destroy
          ProjectExternalLinkActions.removeExternalLinkFromProject({
              project: payload.project,
              external_link: payload.external_link
          });
      }
      var external_link = payload.external_link;
      Utils.dispatch(
        ExternalLinkConstants.REMOVE_LINK,
        {external_link: external_link});

      external_link.destroy().done(function () {
        //NotificationController.success(null, "ExternalLink " + external_link.get('title') + " deleted.");
      }).fail(function () {
        var failureMessage = "Error deleting ExternalLink " + external_link.get('title') + ".";
        NotificationController.error(failureMessage);
        Utils.dispatch(
            ExternalLinkConstants.ADD_LINK,
            {external_link: external_link});
      });
    },

    destroy_noModal: function (payload, options) {
      this.destroy(payload, options);
    }
};
