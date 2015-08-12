define(function (require) {

  var Utils = require('./Utils'),
      $ = require('jquery'),
      Router = require('../Router'),
      stores = require('stores'),
      globals = require('globals'),
      Badge = require('models/Badge'),
      BadgeConstants = require('constants/BadgeConstants'),
      Badges = require("Badges"),
      NotificationController = require('controllers/NotificationController');

  return {

    checkInstanceBadges: function(){
      var instanceCount = stores.InstanceHistoryStore.getAll().meta.count;
      if(instanceCount >= 1){
        this.checkOrGrant(Badges.LAUNCH_1_INSTANCE_BADGE);
      }

      if(instanceCount >= 10){
        this.checkOrGrant(Badges.LAUNCH_10_INSTANCES_BADGE);
      }

    },

    checkBookmarkBadges: function(){
      var favoritedImageCount = stores.ImageBookmarkStore.getBookmarkedImages().length;
      if(favoritedImageCount >= 1){
        this.checkOrGrant(Badges.FAVORITE_1_IMAGE_BADGE); 
      }
      if(favoritedImageCount >= 5){
        this.checkOrGrant(Badges.FAVORITE_5_IMAGES_BADGE);
      }
    },

    checkOrGrant: function(badgeId){
      if(!stores.MyBadgeStore.get(badgeId)){
        console.log(stores.BadgeStore.getAll());
        this.grant({badge: stores.BadgeStore.get(badgeId)});
      }
    },

    // Ask if user deserves badge for something not directly linked to an action
    ask: function(){
      this.checkInstances();
      this.checkBookmarks();
    },

    getCookie: function(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
    },


    grant: function(params){
      var badge = params.badge,
          email = stores.ProfileStore.get().get('email'),
          system = globals.BADGE_SYSTEM,
          secret = globals.BADGE_SECRET,
          csrftoken = this.getCookie('csrftoken'),
          badgeSlug = badge.get('slug');

      $.ajax({
        url: globals.BADGE_HOST,
        type: "POST",
        dataType: 'json',
        contentType: 'application/json',
        headers: {'X-CSRFToken': csrftoken},
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
