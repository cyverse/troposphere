define(['react', 'components/header', 'components/sidebar',
'components/footer', 'components/notifications', 'router',
'controllers/profile', 'components/settings', 'components/projects/list',
'components/applications/list', 'components/applications/favorites',
'components/applications/detail', 'controllers/providers',
'components/providers', 'components/help',
'components/instances/detail', 'components/instances/report',
'components/volume_detail', 'components/applications/search_results',
'collections/instances', 'models/instance', 'collections/volumes',
'models/volume', 'collections/applications', 'models/application', 'controllers/projects'], function
(React, Header, Sidebar, Footer, Notifications, Router, Profile, Settings,
Projects, ApplicationList, ApplicationFavorites, ApplicationDetail,
ProviderController, Providers, Help, InstanceDetail, ReportInstance,
VolumeDetail, ApplicationSearchResults, InstanceCollection, Instance,
VolumeCollection, Volume, AppCollection, Application, ProjectController) {

    var Root = React.createClass({
        getInitialState: function() {
            return {
                loggedIn: this.props.session.isValid(),
                profile: null,
                route: null,
                routeArgs: [],
                providers: null,
                identities: null,
                instances: new InstanceCollection(),
                volumes: new VolumeCollection(),
                applications: new AppCollection()
            };
        },
        handleRoute: function(page, args) {
            if (page === 'handleDefaultRoute')
                return;
            this.setState({route: page, routeArgs: args});
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
        fetchProviders: function() {
            // TODO: fetch providers only on demand in stead of at mount
            ProviderController.getProviders().then(function(providers) {
                this.setState({providers: providers});

                providers.on('change', function(m) {
                    this.setState({providers: providers});
                }.bind(this));
            }.bind(this));
        },
        componentDidMount: function() {
            this.beginRouting();
            if (this.props.session.isValid()) {
                this.fetchProfile();
                this.fetchProviders();
            }
        },
        handleNavigate: function(route, options) {
            this.router.navigate(route, options);
        },
        fetchInstance: function(providerId, identityId, instanceId) {
            var model = new Instance({
                identity: {
                    provider: providerId,
                    id: identityId
                },
                id: instanceId
            });

            model.fetch({
                success: function(instance) {
                    this.state.instances.add(instance);
                    this.setState({instances: this.state.instances});
                }.bind(this)
            });
        },
        fetchVolume: function(providerId, identityId, volumeId) {
            var model = new Volume({
                identity: {
                    provider: providerId,
                    id: identityId
                },
                id: volumeId
            });

            model.fetch({
                success: function(volume) {
                    this.state.volumes.add(volume);
                    this.setState({volumes: this.state.volumes});
                }.bind(this)
            });
        },
        fetchApplication: function(appId) {
            var app = new Application({id: appId});
            app.fetch({success: function(model) {
                this.state.applications.add(model);
                this.setState({applications: this.state.applications});
            }.bind(this)});
        },
        fetchIdentities: function() {
            Profile.getIdentities().then(function(identities) {
                this.setState({identities: identities});
            }.bind(this));
        },
        fetchProjects: function() {
            ProjectController.get().then().then(function(projects) {
                this.setState({projects: projects});

                projects.on('change', function() {
                    this.setState({projects: projects});
                }.bind(this));
            }.bind(this));
        },
        pages: {
            projects: function() {
                return Projects({projects: this.state.projects, onRequestProjects: this.fetchProjects});
            },
            images: function() {
                return ApplicationList();
            },
            appFavorites: function() {
                return ApplicationFavorites();
            },
            appDetail: function(appId) {
                var application = this.state.applications.get(appId);
                return ApplicationDetail({
                    application: application,
                    onRequestApplication: this.fetchApplication.bind(this, appId),
                    onRequestIdentities: this.fetchIdentities,
                    profile: this.state.profile,
                    identities: this.state.identities,
                    providers: this.state.providers
                });
            },
            appSearch: function(query) {
                return ApplicationSearchResults({
                    query: query,
                });
            },
            instanceDetail: function(providerId, identityId, instanceId) {
                var instance = this.state.instances.get(instanceId);
                return InstanceDetail({
                    instance: instance,
                    providers: this.state.providers,
                    onRequestInstance: this.fetchInstance.bind(this, providerId, identityId, instanceId)
                });
            },
            reportInstance: function(providerId, identityId, instanceId) {
                return ReportInstance({
                    instance: this.state.instances.get(instanceId),
                    providers: this.state.providers,
                    onRequestInstance: this.fetchInstance.bind(this, providerId, identityId, instanceId)
                });
            },
            volumeDetail: function(providerId, identityId, volumeId) {
                var volume = this.state.volumes.get(volumeId);
                return VolumeDetail({
                    volume: volume,
                    providers: this.state.providers,
                    onRequestVolume: this.fetchVolume.bind(this, providerId, identityId, volumeId)
                });
            },
            providers: function() {
                // TODO: Get providers lazily
                return Providers({providers: this.state.providers});
            },
            settings: function() {
                return Settings({profile: this.state.profile});
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
                Footer());
        }
    });

    return Root;
});
