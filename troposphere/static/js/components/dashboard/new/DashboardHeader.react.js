/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      propTypes: {
        title: React.PropTypes.string.isRequired
      },

      render: function () {
        return (
          <div className="secondary-nav half-height">
            <div className="container">
              <div className="project-name">
                <h1>{this.props.title}</h1>
              </div>
            </div>
          </div>
        );
      }

    });

  });
