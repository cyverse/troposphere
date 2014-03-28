define(['models/profile', 'collections/identities', 'jquery', 'rsvp'],
function(Profile, Identities, $, RSVP) {
    /* Get Profile and identities beofre we do anything else  */

    if (window.access_token === undefined || window.expires === undefined)
        return null;

    $.ajaxSetup({
        headers: {'Authorization' :'Bearer ' + access_token}
    });

    var profile = new Profile();
    var identities = new Identities();

    $.when(profile.fetch(), identities.fetch()).then(function() {
        console.log(arguments);
    });

    /*
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
    */

    return profile.isNew() ? null : profile;
});
