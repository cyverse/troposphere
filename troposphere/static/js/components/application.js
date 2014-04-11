define(['react', 'components/header', 'components/sidebar',
'components/footer', 'components/notifications', 'components/modal',
'router', 'controllers/profile', 'components/settings', 'components/projects',
'components/images/list', 'components/images/favorites', 'components/images/detail',
'singletons/providers', 'components/providers', 'components/help', 'components/instance_detail', 'components/volume_detail'], function
(React, Header, Sidebar, Footer, Notifications, Modal,
Router, Profile, Settings, Projects, ImageList, ImageFavorites, ImageDetail,
providers, Providers, Help, InstanceDetail, VolumeDetail) {

    var Application = React.createClass({
        getInitialState: function() {
            return {
                loggedIn: this.props.session.isValid(),
                profile: null,
                route: null,
                routeArgs: [],
                providers: providers,
                identities: null
            };
        },
        handleRoute: function(page, args) {
            this.setState({route: page, routeArgs: args});
            if (page === 'imageDetail') {
                Profile.getIdentities().then(function(identities) {
                    this.setState({'identities': identities});
                }.bind(this));
            }
        },
        beginRouting: function() {
            this.router = new Router({
                loggedIn: this.state.loggedIn,
                application: this
            });

            this.router.on("route", this.handleRoute);

            Backbone.history.start({
                pushState: true,
                root: url_root
            });
        },
        fetchProfile: function() {
            Profile.getProfile().then(function(profile) {
                this.setState({profile: profile});

                profile.on('change', function(m) {
                    this.setState({profile: m});
                }.bind(this));
            }.bind(this));
        },
        componentDidMount: function() {
            this.beginRouting();
            this.fetchProfile();
        },
        handleNavigate: function(route, options) {
            this.router.navigate(route, options);
        },
        pages: {
            settings: function() {
                return Settings({profile: this.state.profile});
            },
            projects: function() {
                return Projects();
            },
            instanceDetail: function(providerId, identityId, instanceId) {
                return InstanceDetail({
                    providerId: providerId,
                    identityId: identityId,
                    instanceId: instanceId
                });
            },
            volumeDetail: function(providerId, identityId, volumeId) {
                return VolumeDetail({
                    providerId: providerId,
                    identityId: identityId,
                    volumeId: volumeId
                });
            },
            images: function() {
                return ImageList();
            },
            imageFavorites: function() {
                return ImageFavorites();
            },
            imageDetail: function(imageId) {
                return ImageDetail({
                    image_id: imageId,
                    profile: this.state.profile, 
                    identities: this.state.identities
                });
            },
            providers: function() {
                // TODO: Get providers lazily
                return Providers({providers: this.state.providers});
            },
            help: function() {
                return Help();
            }
        },
        renderContent: function() {
            if (this.state.route)
                return this.pages[this.state.route].apply(this, this.state.routeArgs);
            return React.DOM.div();
        },
        render: function() {
            return React.DOM.div({},
                Header({profile: this.state.profile}),
                Sidebar({loggedIn: this.state.loggedIn, 
                    currentRoute: this.state.route,
                    onNavigate: this.handleNavigate}),
                Notifications(),
                React.DOM.div({id: 'main'}, this.renderContent()),
                Footer(),
                Modal());
        }
    });

    return Application;
});
