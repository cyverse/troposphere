define(
  [
    'q',
    'models/Profile',
    'collections/IdentityCollection',
    'controllers/NotificationController'
  ],
  function (Q, Profile, IdentityCollection, NotificationController) {

    return {
      getProfile: function () {
        var defer = Q.defer();

        var profile = new Profile();

        profile.fetch({
          success: function (m) {
            defer.resolve(m);
          },
          error: function (model, response, options) {
            if (response.status == 401) {
              defer.reject("Not logged in");
            } else {
              defer.reject("Error fetching profile");
            }
          }
        });

        return defer.promise;
      }
    }

  });
