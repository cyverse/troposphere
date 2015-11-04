define(function (require) {

  var Utils = require('./Utils'),
    Router = require('../Router'),
    Constants = require('constants/IdentityMemebershipConstants');

  return {
    update: function (membership, params) {
      var end_date = params.end_date;

      var newAttributes = {
        end_date: end_date.format("YYYY-MM-DDThh:mm:ssZ"),
      };

      membership.set(newAttributes);
      membership.save(newAttributes, {patch: true}).done(function () {
        Utils.dispatch(Constants.UPDATE, {model: membership});
        Utils.dispatch(Constants.REMOVE, {model: membership});
      });
    }
  };

});
