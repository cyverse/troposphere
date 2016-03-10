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

    mixins: [Router.State],

    checkInstanceBadges: function(){
      var instanceCount = stores.InstanceHistoryStore.fetchWhere({unique: true}).meta.count;
      if(instanceCount >= 1){
        this.checkOrGrant(Badges.LAUNCH_1_INSTANCE_BADGE);
      }

      if(instanceCount >= 10){
        this.checkOrGrant(Badges.LAUNCH_10_INSTANCES_BADGE);
      }
    },

    checkBookmarkBadges: function(){
      var favoritedImageCount = stores.ImageBookmarkStore.getAll().meta.count;
      if(favoritedImageCount >= 1){
        this.checkOrGrant(Badges.FAVORITE_1_IMAGE_BADGE);
      }
      if(favoritedImageCount >= 5){
        this.checkOrGrant(Badges.FAVORITE_5_IMAGES_BADGE);
      }
    },

    checkOrGrant: function(badgeId){
      if(globals.BADGES_ENABLED && !stores.MyBadgeStore.get(badgeId)){
        this.grant({badge: stores.BadgeStore.get(badgeId)});
      }
    },

    getCookie: function(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
    },

    clearNotifications: function(){
      Router.getInstance().transitionTo("my-badges");
      NotificationController.clear();
    },

    grant: function(params){
      try{
        var badge = params.badge,
          email = stores.ProfileStore.get().get('email'),
          system = globals.BADGE_SYSTEM,
          secret = globals.BADGE_SECRET,
          csrftoken = this.getCookie('csrftoken'),
          badgeSlug = badge.get('slug');
      }
      catch(err) {
          return;
      }
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
          badge.attributes.assertionUrl = response.instance.assertionUrl;
          badge.attributes.issuedOn = response.instance.issuedOn;
          NotificationController.success("You have earned a badge!", badge.get('name'), {timeOut: 5000, onclick: this.clearNotifications});
          Utils.dispatch(BadgeConstants.GRANT_BADGE, {badge: badge})
        }.bind(this),
        error: function(response){
          console.log("failed", response);
        }
      });

    }


  };

});
