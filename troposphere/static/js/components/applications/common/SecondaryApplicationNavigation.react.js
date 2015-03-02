/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/SecondaryNavigation.react',
    'context'
  ],
  function (React, SecondaryNavigation, context) {

    var routes = [
      {
        name: "Search",
        linksTo: "search",
        href: "/application/images",
        icon: "search",
        requiresLogin: false
      },
      {
        name: "Favorites",
        linksTo: "favorites",
        href: "/application/images/favorites",
        icon: "bookmark",
        requiresLogin: true
      },
      {
        name: "My Images",
        linksTo: "authored",
        href: "/application/images/authored",
        icon: "user",
        requiresLogin: true
      },
      {
        name: "Tags",
        linksTo: "tags",
        href: "/application/images/tags",
        icon: "tags",
        requiresLogin: false
      }
    ];

    return React.createClass({

      propTypes: {
        currentRoute: React.PropTypes.string.isRequired
      },

      render: function () {

        if(!context.profile){
          routes = routes.filter(function(route){
            return !route.requiresLogin;
          })
        }

        return (
          <div>
            <SecondaryNavigation title="" routes={routes} currentRoute={this.props.currentRoute}/>
          </div>
        );

      }

    });

  });
