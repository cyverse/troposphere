define(['react'], function(React) {

    var LoginLink = React.createClass({
        render: function() {
            return React.DOM.a({'href': '/login'}, "Login");
        }
    });

    var LogoutLink = React.createClass({
        render: function() {
            return React.DOM.a({'href': '/logout'}, "Logout " + this.props.username);
        }
    });

    var Header = React.createClass({
        render: function() {

            var profile = this.props.profile;
            var rightChild = profile ? LogoutLink({username: profile.get('username')}) : LoginLink();

            return React.DOM.header({'className': 'clearfix'},
                React.DOM.a(
                    {href: '/', id: 'logo'}, 
                    React.DOM.img({
                        src: '/assets/images/mini_logo.png',
                        alt: 'iPlant Cloud Services',
                        height: '30',
                        width: '30'
                    }), 
                    "Atmosphere ",
                    React.DOM.span({id: 'tagline'}, "iPlant Cloud Services")
                ),
                React.DOM.div({id: 'header-nav'}, rightChild)
            );
        }
    });

    return Header;

});
