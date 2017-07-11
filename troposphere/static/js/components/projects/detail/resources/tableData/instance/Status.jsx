import React from "react";
import Backbone from "backbone";
import StatusLight from "components/projects/common/StatusLight";
import StatusBar from "./StatusBar";

export default React.createClass({
    displayName: "Status",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let instance = this.props.instance,
            instanceState = instance.get("state"),
            status = instanceState.get("status"),
            activity = instanceState.get("activity");

        if (instance.get('end_date')){
            status = "deleted";
            activity = "";
        }

        var lightStatus;

        if (activity || status == "build") {
            lightStatus = "transition";
        } else if (status == "active") {
            lightStatus = "active";
        } else if (instanceState && instanceState.isInactive()) {
            // default of <StatusLight/> is gray,
            // so let's signal inactivity as gray
            lightStatus = "";
        } else if (status == "deleted") {
            lightStatus = "deleted";
        } else {
            lightStatus = "error";
        }

        var style = {
            textTransform: "capitalize"
        };

        if (!instanceState || instanceState.isDeployError()) {
            return (
            <span>
                <div> <StatusLight status="error"/> <span style={style}>{status}</span> </div>
            </span>
            );
        }

        return (
        <span>
            <div> <StatusLight status={lightStatus}/> <span style={style}>{status}</span> </div>
            <StatusBar state={instanceState}
                       activity={activity} />
        </span>
        );
    }
});
