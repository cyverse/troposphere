import React from 'react';
import InstanceMetrics from './metrics/InstanceMetrics.react';

export default React.createClass({
    displayName: "InstanceMetricsSection",

    render: function() {
      return (
          <div>
            <div className="resource-details-section section">
              <h4 className="title">Instance Metrics</h4>
            </div>
            <div id="container" className="metrics">
              <InstanceMetrics
                instance={ this.props.instance }
              />
            </div>
          </div>
      )
    }
})
