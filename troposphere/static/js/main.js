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

require(['jquery', 'react', 'components/root', 'rsvp', 'models/session'],
function($, React, Application, RSVP, Session) {

    // Catch-all for errors within promises
    RSVP.on('error', function(reason) {
        console.assert(false, reason);
    });

    var session = new Session();
    if (window.access_token) {
        $.ajaxSetup({
            headers: {'Authorization' :'Bearer ' + window.access_token}
        });
        session.set({
            access_token: window.access_token,
            expires: window.expires
        });
    }

    $(document).ready(function() {
        var app = Application({session: session});
        React.renderComponent(app, document.getElementById('application'));
    });

});
