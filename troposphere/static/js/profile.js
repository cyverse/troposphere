define(['models/profile', 'collections/identities', 'jquery'], function(Profile, Identities, $) {
    /* Get Profile and identities beofre we do anything else  */

    var access_token = sessionStorage.getItem("access_token");
    var expires = sessionStorage.getItem("expires");
    if (!access_token || !expires)
        return null;

    $.ajaxSetup({
        headers: {'Authorization' :'Bearer ' + access_token}
    });

    var profile = new Profile();

    profile.fetch({
        async: false,
        success: function(model) {
            var identities = new Identities();
            identities.fetch({
                async: false
            });

            model.set('identities', identities);
        },
        error: function(model, response, options) {
            if (response.status == 401) {
                console.log("Not logged in");
            } else {
                console.error("Error fetching profile");
            }
        }
    });

    return profile.isNew() ? null : profile;
});
