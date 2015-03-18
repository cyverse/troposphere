define(function (require) {

  var Utils = require('./Utils');
      Router = require('../Router'),
      Constants = require('constants/QuotaRequestConstants'),
      QuotaRequest = require('models/QuotaRequest');

  return {
      //create: function (params) {
      //    var request = new QuotaRequest({
      //            author: params.author,
      //            comment: params.comment
      //    });
      //    comment.save().done(function(){
      //         Utils.dispatch(Constants.ADD, {model: comment});
      //    });
      //},
      //
      //destroy: function(params){
      //    var comment = params.comment;
      //    comment.destroy().done(function(){
      //        Utils.dispatch(Constants.REMOVE, {model: comment});
      //    })
      //},

      update: function(params) {
        var request = params.request,
            response = params.response,
            quota = params.quota,
            status = params.status;

        request.set({"admin_message": response, "quota": quota, "status": status});
        Router.getInstance().transitionTo("admin");
        Utils.dispatch(Constants.UPDATE, {model: request});
      }
  };

});
