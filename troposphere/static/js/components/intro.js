define(['react'], function(React) {
    var DashboardIcon = React.createClass({
        render: function() {
            return React.DOM.li({}, 
                React.DOM.a({href: '#'}, 
                    React.DOM.img({src: this.props.image}),
                    React.DOM.strong({}, this.props.title),
                    React.DOM.p({}, this.props.description)
                )
            );
        }
    });

    var items = [
        {
            image: static_root + 'images/icon_launchnewinstance.png',
            title: 'Launch New Instance',
            description: 'Browse Atmosphere\'s list of available images and select one to launch a new instance.',
            href: 'app_store'
        },
        {
            image: static_root + 'images/icon_gethelp.png',
            title: 'Browse Help Resources',
            description: 'View a video tutorial, read the how-to guides, or email the Atmosphere support team.',
            href: 'help'
        },
        {
            image: static_root + 'images/icon_settings.png',
            title: 'Change Your Settings',
            description: 'Modify your account settings, view your resource quota, or request more resources.',
            href: 'settings'
        }
    ];

    var Intro = React.createClass({
        render: function() {
            return React.DOM.ul({'id': 'dashboard-link-list'}, _.map(items, DashboardIcon));
        }
    });

    return Intro;

});
