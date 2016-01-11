import React from 'react';
import Backbone from 'backbone';
import StatusLight from 'components/projects/common/StatusLight.react';
import StatusBar from './StatusBar.react';

export default React.createClass({
      displayName: "Status",

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instanceState = this.props.instance.get('state');
        var status = instanceState.get('status');
        var activity = instanceState.get('activity');
        var lightStatus;

        if (activity != undefined) {
            lightStatus = "transition";
        } else if (status == "active") {
            lightStatus = "active";
        } else if (status == "suspended" || status == "shutoff") {
            lightStatus = "inactive";
        } else {
            lightStatus = "error";
        }

        var rawStatus = instanceState.get('status_raw');

        var style = {};
        var capitalizedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

        if (instanceState.isDeployError()) {
          return (
          <span>
            <div>
              <StatusLight status="error"/>
              <span style={style}>{capitalizedStatus}</span>
            </div>
          </span>
          );
        }

        return (
          <span>
            <div>
              <StatusLight status={lightStatus}/>
              <span style={style}>{capitalizedStatus}</span>
            </div>
            <StatusBar state={instanceState} activity={activity}/>
          </span>
        );
      }
});
