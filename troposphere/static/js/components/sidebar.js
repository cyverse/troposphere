define(['react', 'underscore', 'components/common/glyphicon', 'router'], function (React, _, Glyphicon, router) {

    var SidebarListItem = React.createClass({
        handleClick: function(e) {
            e.preventDefault();
            router.navigate(this.props.id.join('/'), {trigger: true});
        },
        render: function() {
            var icon = this.props.icon ? Glyphicon({name: this.props.icon}) : null;

            return React.DOM.li(
                {className: this.props.active ? 'active' : ''}, 
                React.DOM.a(
                    {
                        href: url_root + this.props.id.join('/'),
                        onClick: this.handleClick
                    },
                    icon,
                    this.props.text
                ),
                this.props.children
            );
        }
    });

    var SidebarSubmenu = React.createClass({
        render: function() {
            return React.DOM.ul({}, _.map(this.props.items, function(menu_item) {
                if (!menu_item.login_required || this.props.loggedIn)
                    return SidebarListItem({
                        text: menu_item.text,
                        active: this.props.active && this.props.active.join('/') == menu_item.route.join('/'), // poor man's array equality
                        id: menu_item.route
                    });
            }.bind(this)));
        }
    });

    var menuItems = [
        {
            text: 'Dashboard',
            route: ['dashboard'],
            icon: 'home',
            login_required: true
        },
        {
            text: 'Images',
            route: ['images'],
            icon: 'floppy-disk',
            menu: [
                {
                    text: 'Favorites',
                    route: ['images', 'favorites'],
                    login_required: true
                },
                {
                    text: 'My Images',
                    route: ['images', 'authored'],
                    login_required: true
                }
            ],
            login_required: false
        },
        {
            text: 'Cloud Providers',
            route: ['providers'],
            icon: 'cloud',
            login_required: true
        },
        {
            text: 'Settings',
            route: ['settings'],
            icon: 'cog',
            login_required: true
        },
        {
            text: 'Help',
            route: ['help'],
            icon: 'question-sign',
            login_required: false
        }
    ];

    //prop active route: 'images/authored' 'images/1234'
    var Sidebar = React.createClass({
        getInitialState: function() {
            return {
                active: null
            };
        },
        getDefaultProps: function() {
            return {items: menuItems};
        },
        componentDidMount: function() {
            router.on("route", function(page) {
                if (page == "handleDefaultRoute")
                    return;
                var routeMap = {
                    'imageDetail': ['images'],
                    'imageFavorites': ['images', 'favorites'],
                    'imageAuthored': ['images', 'authored']
                };
                if (routeMap[page])
                    page = routeMap[page];
                else
                    page = [page];
                this.setState({active: page});
            }.bind(this));
        },
        componentWillUnmount: function() {
        },
        render: function() {
            var items = _.map(this.props.items, function(item) {
                if (!item.login_required || this.props.loggedIn)
                    return SidebarListItem({
                        icon: item.icon, 
                        active: this.state.active && item.route[0] == this.state.active[0],
                        text: item.text,
                        id: item.route
                    }, SidebarSubmenu({
                            items: item.menu, 
                            active: this.state.active,
                            loggedIn: this.props.loggedIn
                        }));
            }.bind(this));
            return React.DOM.div({id: 'sidebar'}, React.DOM.ul({}, items));
        }
    });

    return Sidebar;
});
