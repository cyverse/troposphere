define(
  [
    'react',
    'underscore',
    './SidebarListItem.react',
    './Menu.react'
  ],
  function (React, _, SidebarListItem, Menu) {

    var menuItems = [
      {
        text: 'Projects',
        route: ['projects'],
        icon: 'home',
        loginRequired: true
      },
      {
        text: 'Images',
        route: ['images'],
        icon: 'floppy-disk',
        menu: [
          {
            text: 'Favorites',
            route: ['images', 'favorites'],
            loginRequired: true
          },
          {
            text: 'My Images',
            route: ['images', 'authored'],
            loginRequired: true
          }
        ],
        loginRequired: false
      },
      {
        text: 'Cloud Providers',
        route: ['providers'],
        icon: 'cloud',
        loginRequired: true
      },
      {
        text: 'Settings',
        route: ['settings'],
        icon: 'cog',
        loginRequired: true
      },
      {
        text: 'Help',
        route: ['help'],
        icon: 'question-sign',
        loginRequired: false
      }
    ];

    //prop active route: 'images/authored' 'images/1234'
    var Sidebar = React.createClass({
      getDefaultProps: function () {
        return {items: menuItems};
      },
      getRouteList: function (page) {
        console.log(page);
        var routeMap = {
          'appDetail': ['images'],
          'appSearch': ['images'],
          'appFavorites': ['images', 'favorites'],
          'appAuthored': ['images', 'authored']
        };
        if (routeMap[page])
          page = routeMap[page];
        else
          page = [page];
        return page;
      },
      render: function () {
        var active = this.getRouteList(this.props.currentRoute);
        return React.DOM.div({id: 'sidebar'},
          Menu({active: active,
            items: this.props.items,
            onNavigate: this.props.onNavigate,
            loggedIn: this.props.loggedIn,
            depth: 0}));
      }
    });

    return Sidebar;
  });
