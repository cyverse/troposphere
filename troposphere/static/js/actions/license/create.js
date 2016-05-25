
import LicenseConstants from 'constants/LicenseConstants';
import License from 'models/License';
import actions from 'actions';
import Utils from '../Utils';

export default {

    create: function(params){
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
      }).fail(function () {
        Utils.dispatch(LicenseConstants.REMOVE_LICENSE, {license: license}, {silent: false});
      });
      return license;
    }

  };
