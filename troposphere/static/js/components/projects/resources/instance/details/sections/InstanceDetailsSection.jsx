import React from "react";
import Backbone from "backbone";

// Resource Detail;
import Id from "./details/Id";
import Alias from "./details/Alias";
import Status from "./details/Status";
import Activity from "./details/Activity";
import Size from "./details/Size";
import IpAddress from "./details/IpAddress";
import LaunchDate from "./details/LaunchDate";
import CreatedFrom from "./details/CreatedFrom";
import Identity from "./details/Identity";

export default React.createClass({
    displayName: "InstanceDetailsSection",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var instance = this.props.instance;

        return (
        <div className="resource-details-section section">
            <h4 className="t-title">Instance Details</h4>
            <ul style={{ paddingLeft: "10px" }}>
                <Status instance={instance} />
                <Activity instance={instance} />
                <Size instance={instance} />
                <IpAddress instance={instance} />
                <LaunchDate instance={instance} />
                <CreatedFrom instance={instance} />
                <Identity instance={instance} />
                <Id instance={instance} />
                <Alias instance={instance} />
            </ul>
        </div>
        );
    }
});
