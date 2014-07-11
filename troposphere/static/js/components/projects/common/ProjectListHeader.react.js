/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        title: React.PropTypes.string.isRequired,
        children: React.PropTypes.component
      },

      render: function () {
        return (
          <div className="secondary-nav half-height">
            <div className="container">
              <div className="project-name">
                <h1>{this.props.title}</h1>
                {this.props.children}
              </div>
            </div>
          </div>
        );
      }

    });

  });
