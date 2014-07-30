/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/StatusLight.react'
  ],
  function (React, Backbone, StatusLight) {

    return React.createClass({

      propTypes: {
        state: React.PropTypes.string.isRequired,
        activity: React.PropTypes.string
      },

      render: function () {
        var state = this.props.state;
        var activity = this.props.activity;
        var style = {width: "0%"};

        style.width = "40%";

        return (
          <div className="progress">
            <div className="progress-bar progress-bar-success" style={style}>
              {style.width}
            </div>
          </div>
        );
      }

    });

  });
