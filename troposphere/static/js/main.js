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
        'react': '//cdnjs.cloudflare.com/ajax/libs/react/0.10.0/react'
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

require(['jquery', 'backbone', 'react', 'components/application', 'profile', 'router'], function($, Backbone, React, Application, profile, router) {

    $(document).ready(function() {
        var app = Application();
        React.renderComponent(app, document.getElementById('application'));

        var route = profile != null ? 'projects' : 'images';
        router.setDefaultRoute(route);

        Backbone.history.start({
            pushState: true,
            root: url_root
        });
    });

});
