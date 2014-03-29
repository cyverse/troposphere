define(['react', 'underscore', 'components/header', 'components/sidebar', 
        'components/footer', 'components/notifications', 'components/modal'],
function (React, _, Header, Sidebar, Footer, Notifications, Modal) {

    var Application = React.createClass({
        render: function() {
            return React.DOM.div({},
                Header({profile: this.props.profile}),
                Sidebar({loggedIn: this.props.profile != null}),
                Notifications(),
                React.DOM.div({id: 'main'}),
                Footer(),
                Modal());
        }
    });

    return Application;
});
