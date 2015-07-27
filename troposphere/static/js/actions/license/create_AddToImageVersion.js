define(function (require) {
  'use strict';

  var LicenseConstants = require('constants/LicenseConstants'),
      License = require('models/License'),
      actions = require('actions'),
      Utils = require('../Utils');

  return {

    create_AddToImageVersion: function(params){

      if(!params.name) throw new Error("Missing name");
      if(!params.description) throw new Error("Missing description");
      if(!params.image_version) throw new Error("Missing image_version");

      var name = params.name,
          image_version = params.image_version,
          description = params.description;

      var license = new License({
        name: name,
        description: description
      });

      // Add the license optimistically
      Utils.dispatch(LicenseConstants.ADD_LICENSE, {license: license}, {silent: false});

      license.save().done(function () {
        Utils.dispatch(LicenseConstants.UPDATE_LICENSE, {license: license}, {silent: false});
        Utils.dispatch(LicenseConstants.REMOVE_PENDING_LICENSE_FROM_VERSION, {license: license, image_version: image_version});
        actions.ImageVersionLicenseActions.add({
          image_version: image_version,
          license: license
        });
      }).fail(function () {
        Utils.dispatch(LicenseConstants.REMOVE_LICENSE, {license: license}, {silent: false});
        Utils.dispatch(LicenseConstants.REMOVE_PENDING_LICENSE_FROM_VERSION, {license: license, image_version: image_version});
      });

      Utils.dispatch(LicenseConstants.ADD_PENDING_LICENSE_TO_VERSION, {license: license, image_version: image_version});

    }

  };

});
