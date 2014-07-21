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
        href: "/application/images",
        icon: "search",
        requiresLogin: false
      },
      {
        name: "Favorites",
        href: "/application/images/favorites",
        icon: "bookmark",
        requiresLogin: true
      },
      {
        name: "My Images",
        href: "/application/images/authored",
        icon: "user",
        requiresLogin: true
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
            <SecondaryNavigation title="Images" routes={routes} currentRoute={this.props.currentRoute}/>
          </div>
        );

      }

    });

  });
