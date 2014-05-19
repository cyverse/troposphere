define(
  [
    'rsvp',
    'models/profile',
    'collections/identities',
    'controllers/notifications'
  ],
  function (RSVP, Profile, Identities, Notifications) {

    return {
      getProfile: function () {
        return new RSVP.Promise(function (resolve, reject) {
          new Profile().fetch({
            success: function (m) {
              resolve(m);
            },
            error: function (model, response, options) {
              if (response.status == 401) {
                reject("Not logged in");
              } else {
                reject("Error fetching profile");
              }
            }
          });
        });
      },

      getIdentities: function () {
        return new RSVP.Promise(function (resolve, reject) {
          new Identities().fetch({
            success: function (m) {
              resolve(m);
            }
          });
        });
      },

      setIcons: function (profile, icon_type) {
        profile.save({icon_set: icon_type}, {
          patch: true,
          success: function () {
            Notifications.success("Updated", "Your icon preference was changed successfully.");
          }.bind(this),
          error: function () {
            Notifications.danger("Error", "Your icon preference was not changed successfully.");
          }
        });
      }
    }

  });
