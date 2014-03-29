define(['models/profile', 'collections/identities'],
function(Profile, Identities) {

    if (window.access_token === undefined || window.expires === undefined)
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
            throw "Invalid access token";
        }
    });

    return profile;

});
