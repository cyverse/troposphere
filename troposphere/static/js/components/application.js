define(['react', 'underscore', 'components/header', 'components/sidebar', 
        'components/footer', 'components/notifications'],
function (React, _, Header, Sidebar, Footer, Notifications) {

    var Application = React.createClass({
        render: function() {
            return React.DOM.div({},
                Header({profile: this.props.profile}),
                Sidebar({loggedIn: this.props.profile != null}),
                Notifications(),
                React.DOM.div({id: 'main'}),
                Footer()
            );
        }
    });

    return Application;
});
