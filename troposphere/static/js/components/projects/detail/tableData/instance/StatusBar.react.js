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
        state: React.PropTypes.instanceOf(InstanceState).isRequired,
        activity: React.PropTypes.string
      },

      render: function () {
        var state = this.props.state;
        var activity = this.props.activity;

        var percentComplete = this.props.state.getPercentComplete();
        var style = {width: "0%"};

        style.width = percentComplete + "%";

        if(!percentComplete || percentComplete === 100){
          return (
            null
          );
        }

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
