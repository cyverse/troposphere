define(['react', 'underscore', 'components/header', 'components/sidebar', 
        'components/footer', 'components/notifications', 'profile'],
function (React, _, Header, Sidebar, Footer, Notifications, profile) {

    var Application = React.createClass({
        render: function() {
            return React.DOM.div({},
                Header(),
                Sidebar({loggedIn: profile != null}),
                Notifications(),
                React.DOM.div({id: 'main'}),
                Footer()
            );
        }
    });

    return Application;
});
