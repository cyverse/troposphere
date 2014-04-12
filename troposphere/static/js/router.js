define(['backbone', 'react', 'rsvp'], function(Backbone, React, RSVP) {
    var Router = Backbone.Router.extend({
        initialize: function(options) {
            this.defeaultRoute = 'images';
            if (options && options.loggedIn)
                this.defaultRoute = 'projects';
            this.application = options.application;
        },
        routes: {
            '': 'handleDefaultRoute',
            'projects': 'projects',
            'images': 'images',
            'images/favorites': 'appFavorites',
            'images/authored': 'appAuthored',
            'images/:id': 'appDetail',
            'images/search/:query': 'appSearch',
            'provider/:provider_id/identity/:identity_id/instances/:instance_id': 'instanceDetail',
            'provider/:provider_id/identity/:identity_id/volumes/:volume_id': 'volumeDetail',
            'providers': 'providers',
            'settings': 'settings',
            'help': 'help'
        },
        handleDefaultRoute: function() {
            this.navigate(this.defaultRoute, {trigger: true, replace: true});
        }
    });

    return Router;
});
