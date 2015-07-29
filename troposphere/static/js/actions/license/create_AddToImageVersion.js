define(function (require) {
  'use strict';

  var LicenseConstants = require('constants/LicenseConstants'),
      License = require('models/License'),
      actions = require('actions'),
      Utils = require('../Utils');

  return {

    create_AddToImageVersion: function(image_version, params){

      if(!params.title) throw new Error("Missing title");
      if(!params.type) throw new Error("Missing type");
      if(!params.text) throw new Error("Missing text");

      var title = params.title,
        license_type = params.type,
        text = params.text;

      var license = new License({
        title: title,
        type: license_type,
        text: text
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
