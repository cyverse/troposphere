define(function (require) {
  "use strict";

  var React = require('react/addons'),
    actions = require('actions'),
    stores = require('stores'),
    modals = require('modals'),
    _ = require('underscore');

  return {

    createAndAddToProject: function (options) {
      if (!options.project)
        throw new Error("Missing project");

      modals.InstanceModals.launch(_.extend({ initialView: "IMAGE_VIEW" }, options));
    }

  };

});
