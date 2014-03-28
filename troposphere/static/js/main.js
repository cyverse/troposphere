require.config({
    baseUrl: static_root + 'js',
    paths: {
        /* TODO: use minified versions in production */
        'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery',
        'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
        'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
        'google': 'https://www.google.com/jsapi',
        'bootstrap': '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/js/bootstrap',
        'moment': '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min',
        'react': '//cdnjs.cloudflare.com/ajax/libs/react/0.10.0/react',
        'rsvp': '//cdn.jsdelivr.net/rsvp/3.0/rsvp.amd.min'
    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        bootstrap: {
            deps: ['jquery']
        }
    }
});

require(['jquery', 'backbone', 'react', 'components/application', 'router',
'models/profile', 'collections/identities'], function($, Backbone, React, Application, router, Profile, Identities) {
    
    function get_profile() {
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
    }

    $(document).ready(function() {
        var profile = get_profile();

        var app = Application({profile: profile});
        React.renderComponent(app, document.getElementById('application'));

        router.setProfile(profile);

        Backbone.history.start({
            pushState: true,
            root: url_root
        });
    });

});
