define(['backbone', 'react', 'rsvp'], function(Backbone, React, RSVP) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'handleDefaultRoute',
            'projects': 'projects',
            'images': 'images',
            'images/favorites': 'imageFavorites',
            'images/authored': 'imageAuthored',
            'images/:id': 'imageDetail',
            //'instances': 'instances',
            'provider/:provider_id/identity/:identity_id/instances/:instance_id': 'instanceDetail',
            //'volumes': 'volumes',
            'provider/:provider_id/identity/:identity_id/volumes/:volume_id': 'volumeDetail',
            'providers': 'providers',
            'settings': 'settings',
            'help': 'help'
        },
        setProfile: function(profile) {
            this.profile = profile;
            this.defaultRoute = profile != null ? 'projects' : 'images';
        },
        handleDefaultRoute: function() {
            this.navigate(this.defaultRoute, {trigger: true, replace: true});
        },
        setView: function(requirements, callback) {
            var node = document.getElementById('main');
            var loading = React.DOM.div({className: 'loading'});
            React.renderComponent(loading, node);
            require(requirements, function() {
                var result = callback.apply(this, arguments);
                if (typeof(result.then) === 'function')
                    result.then(function(view) {
                        React.renderComponent(view, node);
                    });
                else
                    React.renderComponent(result, node);
            }.bind(this));
        },
        projects: function() {
            this.setView(['components/projects', 'collections/projects'], function(Projects, Collection) {
                var coll = new Collection();
                return new RSVP.Promise(function(resolve, reject) {
                    coll.fetch({success: function() {
                        resolve(Projects({projects: coll}));
                    }});
                });
            });
        },
        images: function() {
            this.setView(['components/images/list'], function(Images) {
                return Images();
            });
        },
        imageFavorites: function() {
            this.setView(['components/images/favorites'], function(Favorites) {
                return Favorites();
            });
        },
        imageAuthored: function() {
        },
        imageDetail: function(id) {
            this.setView(['components/images/detail'], function(ImageDetail) {
                return ImageDetail({image_id: id});
            });
        },
        /*
        instances: function() {
            this.setView(['components/instances'], function(Instances) {
                return Instances();
            });
        },
        volumes: function() {
            this.setView(['components/volumes'], function(Volumes) {
                return Volumes();
            });
        },
        */
        instanceDetail: function(provider_id, identity_id, instance_id) {
            this.setView(['collections/instances',
            'components/instance_detail'], function(Instances, InstanceDetail) {
                var coll = new Instances([], {provider_id: provider_id, identity_id: identity_id});
                return new RSVP.Promise(function(resolve, reject) {
                    coll.fetch({success: function() {
                        var instance = coll.get(instance_id);
                        if (instance === undefined)
                            throw "Unknown instance " + instance_id;
                        resolve(InstanceDetail({instance: instance}));
                    }});
                });
            });
        },
        volumeDetail: function(provider_id, identity_id, volume_id) {
            this.setView(['collections/volumes', 'components/volume_detail'], function(Volumes, VolumeDetail) {
                var volumes = new Volumes([], {provider_id: provider_id, identity_id: identity_id});
                return new RSVP.Promise(function(resolve, reject) {
                    volumes.fetch({success: function() {
                        var volume = volumes.get(volume_id);
                        if (volume === undefined)
                            throw "Unknown volume " + volume_id;

                         resolve(VolumeDetail({volume: volume}));
                    }});
                });
            });
        },
        providers: function() {
            this.setView(['components/providers', 'singletons/providers'], function(Providers, collection) {
                return Providers({providers: collection});
            });
        },
        settings: function() {
            this.setView(['components/settings'], function(Settings) {
                return Settings({profile: this.profile});
            });
        },
        help: function() {
            this.setView(['components/help'], function(Help) {
                return Help();
            });
        }
    });

    return new Router();
});
