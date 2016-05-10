define(
  [
    'react',
    'backbone',
    'components/projects/common/StatusLight.react',
    './StatusBar.react'
  ],
  function (React, Backbone, StatusLight, StatusBar) {

    return React.createClass({
      displayName: "Status",

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instanceState = this.props.instance.get('state');
        var status = instanceState.get('status');
        var activity = instanceState.get('activity');
        var lightStatus;

        if (activity || status == "build") {
            lightStatus = "transition";
        } else if (status == "active") {
            lightStatus = "active";
        } else if (status == "suspended" || status == "shutoff") {
            lightStatus = "inactive";
        } else {
            lightStatus = "error";
        }

        var rawStatus = instanceState.get('status_raw');

        var style = {textTransform: "capitalize"};

        if (instanceState.isDeployError()) {
          return (
          <span>
            <div>
              <StatusLight status="error"/>
              <span style={style}>{status}</span>
            </div>
          </span>
          );
        }

        return (
          <span>
            <div>
              <StatusLight status={lightStatus}/>
              <span style={style}>{status}</span>
            </div>
            <StatusBar state={instanceState} activity={activity}/>
          </span>
        );
      }

    });

  });
