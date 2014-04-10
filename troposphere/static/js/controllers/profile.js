define(['rsvp', 'models/profile', 'collections/identities'], 
function(RSVP, Profile, Identities) {

    return {
        getProfile: function() {
            return new RSVP.Promise(function(resolve, reject) {
                new Profile().fetch({
                    success: function(m) {
                        resolve(m);
                    },
                    error: function(model, response, options) {
                        if (response.status == 401) {
                            reject("Not logged in");
                        } else {
                            reject("Error fetching profile");
                        }
                    }
                });
            });
        },
        getIdentities: function() {
            return new RSVP.Promise(function(resolve, reject) {
                new Identities().fetch({
                    success: function(m) {
                        resolve(m);
                    }
                });
            });
        }
    }

});
