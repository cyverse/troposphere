define(function (require) {

  var Utils = require('./Utils'),
      Router = require('../Router'),
      stores = require('stores'),
      globals = require('globals'),
      BadgeConstants = require('constants/BadgeConstants'),
      NotificationController = require('controllers/NotificationController');

  return {

    userHasBadge: function(badge){
      if(stores.MyBadgeStore.get(badge)) return true;
        return false;
      },

    checkInstances: function(){
      var instanceCount = stores.InstanceHistoryStore.getAll().meta.count;
      if(instanceCount >= 1){
        if(!this.userHasBadge(4)){
          this.grant({badge: stores.BadgeStore.get(4)})
        }
      }


      if(instanceCount >= 10){
        if(!this.userHasBadge(1)){
          this.grant({badge: stores.BadgeStore.get(1)});
        }
      }

    },

    ask: function(){
      this.checkInstances();
    },

    askSupport: function(){
      this.grant({badge: stores.BadgeStore.get(2)});
    },

    askProject: function(){
      this.grant({badge: stores.BadgeStore.get(3)})
    },

    askVolume: function(){
      this.grant({badge: stores.BadgeStore.get(5)})
    },

    grant: function(params){
      var badge = params.badge,
          email = stores.ProfileStore.get().get('email'),
          system = globals.BADGE_SYSTEM,
          secret = globals.BADGE_SECRET,
          badgeSlug = badge.get('slug');

      $.ajax({
        url: globals.BADGE_HOST + "/1",
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
