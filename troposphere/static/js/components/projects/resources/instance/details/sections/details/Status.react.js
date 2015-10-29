import React from 'react';
import Backbone from 'backbone';
import ResourceDetail from 'components/projects/common/ResourceDetail.react';
import StatusLight from 'components/projects/common/StatusLight.react';
import StatusBar from 'components/projects/detail/resources/tableData/instance/StatusBar.react';


export default React.createClass({
    displayName: "Status",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
        var instanceState = this.props.instance.get('state');
        var status = instanceState.get('status');
        var activity = instanceState.get('activity');
        var lightStatus = "transition";

        if (status === "active" && !activity) {
          lightStatus = "active";
        } else if (status === "suspended" && !activity) {
          lightStatus = "inactive";
        } else if (status === "shutoff" && !activity) {
          lightStatus = "inactive";
        }

        var rawStatus = instanceState.get('status_raw');

        var style = {};
        var capitalizedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

        if (instanceState.isDeployError()) {
          return (
            <span>
              <div>
                <span style={{color: "#d44950"}}>{"Launch failed. Atmosphere at capacity."}</span>
              </div>
            </span>
          );
        }

        return (
          <ResourceDetail label="Status">
            <div className="resource-status">
              <StatusLight status={lightStatus}/>
              <span style={style}>{capitalizedStatus}</span>
              <StatusBar state={instanceState}/>
            </div>
          </ResourceDetail>
        );
    }
});
