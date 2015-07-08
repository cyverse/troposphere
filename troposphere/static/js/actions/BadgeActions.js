define(function (require) {

  var Utils = require('./Utils'),
      Router = require('../Router'),
      stores = require('stores'),
      globals = require('globals'),
      BadgeConstants = require('constants/BadgeConstants'),
      NotificationController = require('controllers/NotificationController'),
      QuotaRequest = require('models/QuotaRequest');

  return {
    checkInstances: function(){
      if(stores.InstanceHistoryStore.getAll().meta.count >= 10){
        this.grant({badge: stores.BadgeStore.get(9)});
      }
    },

    ask: function(){
      this.checkInstances();
    },

    grant: function(params){
      var badge = params.badge,
          email = "prosif@gmail.com"
            //stores.ProfileStore.get().get('email'),
          system = globals.BADGE_SYSTEM,
          secret = globals.BADGE_SECRET,
          badgeSlug = badge.get('slug');

      $.ajax({
        url: globals.BADGE_HOST + "/grant",
        type: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          email: email,
          system: system,
          badgeSlug: badgeSlug,
          secret: secret
        }),
        success: function(response){
          console.log(response);
          NotificationController.info("You have earned a badge!");
          Utils.dispatch(BadgeConstants.GRANT_BADGE, {badge: badge})
        },
        error: function(response){
          console.log("failed", response);
        }
      });

    }


  };

});
