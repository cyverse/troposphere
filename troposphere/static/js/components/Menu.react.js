/** @jsx React.DOM */

define(
  [
    'react',
    'underscore',
    './SidebarListItem.react'
  ],
  function (React, _, SidebarListItem) {

    var Menu = React.createClass({
      render: function () {
        var active = this.props.active;
        var depth = this.props.depth;

        var items = _.map(this.props.items, function (item) {
          if (!item.loginRequired || this.props.loggedIn) {
            var submenu = null;
            var isActive = active && item.route[depth] == active[depth];

            if (item.menu) {
              submenu = (
                <Menu
                  onNavigate={this.props.onNavigate}
                  items={item.menu}
                  active={active}
                  loggedIn={this.props.loggedIn}
                  depth={depth + 1}
                />
              );
            }

            return (
              <SidebarListItem
                icon={item.icon}
                active={isActive}
                text={item.text}
                id={item.route}
                key={item.text}
                onNavigate={this.props.onNavigate}
              >
                {submenu}
              </SidebarListItem>
            );
          }
        }.bind(this));

        return (
          <ul>{items}</ul>
        );
      }
    });

    return Menu;

  });
