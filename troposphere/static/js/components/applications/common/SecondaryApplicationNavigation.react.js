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
        href: "/application/images"
      },
      {
        name: "Favorites",
        href: "/application/images/favorites"
      },
      {
        name: "My Images",
        href: "/application/images/authored"
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
