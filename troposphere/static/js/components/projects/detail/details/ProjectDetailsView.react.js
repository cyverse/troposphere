/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/SecondaryProjectNavigation.react'
  ],
  function (React, Backbone, SecondaryProjectNavigation) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        children: React.PropTypes.component.isRequired
      },

      render: function () {
        return (
          <div className="project-details">
            <SecondaryProjectNavigation project={this.props.project} currentRoute="details"/>
            <div className="container">
              {this.props.children}
            </div>
          </div>
        );
      }

    });

  });
