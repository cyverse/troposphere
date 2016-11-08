import React from "react";
import InstanceMetrics from "./metrics/InstanceMetrics";

export default React.createClass({
    displayName: "InstanceMetricsSection",

    render: function() {
        var inactive = this.props.instance.get("end_date") ? true : false;
        return (
        <div>
            <div className="resource-details-section section">
                <h4 className="t-title">Instance Metrics</h4>
            </div>
            <div id="container" className="metrics">
                <InstanceMetrics instance={this.props.instance} inactive={inactive} />
            </div>
        </div>
        );
    }
});
