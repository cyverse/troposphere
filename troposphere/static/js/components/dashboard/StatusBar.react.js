/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'models/InstanceState'
  ],
  function (React, Backbone, InstanceState) {

    return React.createClass({

      propTypes: {
        value: React.PropTypes.number.isRequired,
        maxValue: React.PropTypes.number.isRequired
      },

      render: function () {
        var percentComplete = Math.ceil(this.props.value/this.props.maxValue*100);
        var percentCompleteString = percentComplete + "%";

        var style = {
          width: percentCompleteString
        };

        return (
          <div className="progress">
            <div className="progress-bar progress-bar-success" style={style}>
              {percentCompleteString}
            </div>
          </div>
        );
      }

    });

  });
