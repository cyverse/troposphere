/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/SecondaryNavigation.react'
  ],
  function (React, SecondaryNavigation) {

    var routes = [
      {
        name: "Search",
        href: "/application/images",
        icon: "search"
      },
      {
        name: "Favorites",
        href: "/application/images/favorites",
        icon: "bookmark"
      },
      {
        name: "My Images",
        href: "/application/images/authored",
        icon: "user"
      }
    ];

    return React.createClass({

      propTypes: {
        currentRoute: React.PropTypes.string.isRequired
      },

      render: function () {
        return (
          <div>
            <SecondaryNavigation title="Images" routes={routes} currentRoute={this.props.currentRoute}/>
          </div>
        );

      }

    });

  });
