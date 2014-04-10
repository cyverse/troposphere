define(['react', 'components/header', 'components/sidebar',
'components/footer', 'components/notifications', 'components/modal',
'router', 'controllers/profile'],
function (React, Header, Sidebar, Footer, Notifications, Modal, Router, Profile)
{

    var Application = React.createClass({
        getInitialState: function() {
            return {
                loggedIn: this.props.session.isValid(),
                profile: null,
                currentRoute: null
            };
        },
        componentWillUpdate: function(nextProps, nextState) {
            this.router.setProfile(nextState.profile); 
        },
        handleRoute: function(page) {
            console.log(arguments);
            this.setState({currentRoute: page});
        },
        beginRouting: function() {
            this.router = new Router({
                loggedIn: this.state.loggedIn
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

                /*
                profile.on('change', function(model) {
                    console.log('change');
                    this.setState({profile: model});
                }.bind(this));
                */
            }.bind(this));
        },
        componentDidMount: function() {
            this.beginRouting();
            this.fetchProfile();
        },
        handleNavigate: function(route, options) {
            this.router.navigate(route, options);
        },
        render: function() {
            return React.DOM.div({},
                Header({profile: this.state.profile}),
                Sidebar({loggedIn: this.state.loggedIn, 
                    currentRoute: this.state.currentRoute,
                    onNavigate: this.handleNavigate}),
                Notifications(),
                React.DOM.div({id: 'main'}),
                Footer(),
                Modal());
        }
    });

    return Application;
});
