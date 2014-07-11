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
            href: "/application/projects/" + this.props.project.id,
            icon: "th"
          }
        ];

        return (
          <div>
            <SecondaryNavigation title={this.props.project.get('name')} routes={routes} currentRoute={this.props.currentRoute}/>
          </div>
        );

      }

    });

  });
