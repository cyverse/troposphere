define(function (require) {
  "use strict";

  var ExternalLinkConstants = require('constants/ExternalLinkConstants'),
    Utils = require('../Utils');

  return {

    update: function (external_link, newAttributes) {
      if (!external_link) throw new Error("Missing external_link");

      //Name, Description, and Link will be allowedrow new Error("Missing attributes.name");
      var containsUpdate = ['title','description','link'].some(function(value) {
          return value in newAttributes;
      });
      if(!containsUpdate) throw new Error("Missing attributes: [title, description, link]")

      external_link.set(newAttributes);

      Utils.dispatch(ExternalLinkConstants.UPDATE_LINK, {external_link: external_link});

      external_link.save(newAttributes, {
        patch: true
      }).done(function () {
        // Nothing to do here
      }).fail(function (response) {
        Utils.displayError({title: "ExternalLink could not be updated", response: response});
      }).always(function () {
        Utils.dispatch(ExternalLinkConstants.UPDATE_LINK, {external_link: external_link});
      });
    }

  };

});
