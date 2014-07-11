/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/SecondaryNavigation.react'
  ],
  function (React, SecondaryNavigation) {

    return React.createClass({

      propTypes: {
        currentRoute: React.PropTypes.string.isRequired,
        project: React.PropTypes.string.isRequired
      },

      render: function () {
        var routes = [
          {
            name: "Resources",
            href: "/application/projects/" + this.props.project.id
          }
        ];

        return (
          <div>
            <SecondaryNavigation title="Images" routes={routes} currentRoute={this.props.currentRoute}/>
          </div>
        );

      }

    });

  });
