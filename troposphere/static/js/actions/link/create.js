import ExternalLinkConstants from 'constants/ExternalLinkConstants';
import ExternalLink from 'models/ExternalLink';
import Utils from '../Utils';

export default {

    create: function (params) {
      if (!params.name) throw new Error("Missing name");
      if (!params.description) throw new Error("Missing description");
      if (!params.external_link) throw new Error("Missing external_link");

      var name = params.name,
        description = params.description,
        link = params.external_link;

      var external_link = new ExternalLink({
        name: name,
        description: description,
        link: link
      });

      // Add the external_link optimistically
      Utils.dispatch(
        ExternalLinkConstants.ADD_LINK,
        {external_link: external_link},
        {silent: false});

      external_link.save().done(function () {
        Utils.dispatch(
            ExternalLinkConstants.UPDATE_LINK,
            {external_link: external_link},
            {silent: false});
      }).fail(function (response) {
        Utils.dispatch(
            ExternalLinkConstants.REMOVE_LINK,
            {external_link: external_link},
            {silent: false});
        Utils.displayError(
            {
                title: "ExternalLink could not be created",
                response: response
            }
        );
      });
      return external_link;
    }
};
