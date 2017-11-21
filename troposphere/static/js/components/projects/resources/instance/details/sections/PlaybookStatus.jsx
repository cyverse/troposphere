import React from "react";
import Backbone from "backbone";
import StatusLight from "components/projects/common/StatusLight";
import ProgressBar from "components/common/ui/ProgressBar";

export default React.createClass({
    displayName: "Status",

    propTypes: {
        instancePlaybookHistory: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    isInError: function(instancePlaybookStatus) {
        if(instancePlaybookStatus == 'error' || instancePlaybookStatus == 'deploy_error') {
            return true;
        }
        return false;
    },
    renderProgressBar: function(percentComplete) {
        if(percentComplete == 100) {
            return;
        }
        return (<ProgressBar
                    startColor={"#56AA21"}
                    startValue={percentComplete}
                />);
    },
    render: function() {
        let instancePlaybookHistory = this.props.instancePlaybookHistory,
            status = instancePlaybookHistory.get("status"),
            lightStatus,
            percentComplete = 0;

        if (status == "queued") {
            // default of <StatusLight/> is gray,
            // so let's signal inactivity as gray
            lightStatus = "";
        } else if (status == "pending") {
            lightStatus = "transition";
            percentComplete = 20;
        } else if (status == "running") {
            lightStatus = "transition";
            percentComplete = 60;
        } else if (status == "completed") {
            lightStatus = "active";
            percentComplete = 100;
        } else {
            lightStatus = "error";
            percentComplete = 100;
        }

        var style = {
            textTransform: "capitalize"
        };
        if (this.isInError(status)) {
            return (
            <span>
                <StatusLight status="error"/> <span style={style}>{status}</span>
            </span>
            );
        }

        return (
        <span>
            <StatusLight status={lightStatus}/> <span style={style}>{status}</span>
            {this.renderProgressBar(percentComplete)}
        </span>
        );
    }
});
