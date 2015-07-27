define(function (require) {
  'use strict';

  var LicenseConstants = require('constants/LicenseConstants'),
      License = require('models/License'),
      actions = require('actions'),
      Utils = require('../Utils');

  return {

    create: function(params){
      if(!params.name) throw new Error("Missing name");
      if(!params.description) throw new Error("Missing description");

      var name = params.name,
          description = params.description;

      var license = new License({
        name: name,
        description: description
      });

      // Add the license optimistically
      Utils.dispatch(LicenseConstants.ADD_LICENSE, {license: license}, {silent: false});

      license.save().done(function () {
        Utils.dispatch(LicenseConstants.UPDATE_LICENSE, {license: license}, {silent: false});
      }).fail(function () {
        Utils.dispatch(LicenseConstants.REMOVE_LICENSE, {license: license}, {silent: false});
      });
    }

  };

});
