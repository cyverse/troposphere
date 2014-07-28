/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/StatusLight.react'
  ],
  function (React, Backbone, StatusLight) {

    var get_percent_complete = function(state, activiy) {

      // Number represents percent task *completed* when in this state
      var states = {
        'build': {
          'block_device_mapping': 10,
          'scheduling': 20,
          'networking': 30,
          'spawning': 40
        },
        'active': {
          'powering-off': 50,
          'image_uploading': 50,
          'deleting': 50,
          'suspending': 50,
          'initializing': 50,
          'networking': 60,
          'deploying': 70
        },
        'shutoff': {
          'powering-on': 50
        },
        'suspended': {
          'resuming': 50
        }
      };

      return states[state][activiy];
    };

    var get_final_state = function (activity) {
      // Check for the final state to prevent reverting if a queued task hasn't begun yet
      if (activity === 'powering-off') {
        return 'shutoff';
      }
      else if (activity === 'deleting') {
        return 'deleted';
      }
      else if (activity === 'suspending') {
        return 'suspended';
      }
      else if (activity === 'deploy_error') {
        return 'deploy_error';
      }
      else {
        // Applies for: build, shutoff, and suspended
        return 'active';
      }
    };

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
