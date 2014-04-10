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
        componentWillUpdate: function(nextProps, nextState) {
            //this.router.setProfile(nextState.profile); 
            console.log('new state!');
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
            }.bind(this));
        },
        componentDidMount: function() {
            this.beginRouting();
            this.fetchProfile();
        },
        handleNavigate: function(route, options) {
            this.router.navigate(route, options);
        },
        renderContent: function() {
            if (this.state.route === 'settings')
                return Settings({profile: this.state.profile});
            else if (this.state.route === 'projects')
                return Projects();
            else if (this.state.route === 'instanceDetail')
                return InstanceDetail({
                    providerId: this.state.routeArgs[0],
                    identityId: this.state.routeArgs[1],
                    instanceId: this.state.routeArgs[2]
                });
            else if (this.state.route === 'volumeDetail')
                return VolumeDetail({
                    providerId: this.state.routeArgs[0],
                    identityId: this.state.routeArgs[1],
                    volumeId: this.state.routeArgs[2]
                });
            else if (this.state.route == 'images')
                return ImageList();
            else if (this.state.route == 'imageFavorites')
                return ImageFavorites();
            else if (this.state.route === 'imageDetail')
                return ImageDetail({
                    image_id: this.state.routeArgs[0], 
                    profile: this.state.profile, 
                    identities: this.state.identities
                });
            else if (this.state.route === 'providers') // Get providers lazily
                return Providers({providers: this.state.providers});
            else if (this.state.route === 'help')
                return Help();
            return React.DOM.div({className: 'loading'});
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
