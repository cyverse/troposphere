import React from "react";
import ProgressBar from "components/common/ui/ProgressBar";

export default React.createClass({
    propTypes: {
        onRequestResources: React.PropTypes.func,
        resourcesUsed: React.PropTypes.object,
    },

    // This is what we show if the instance will exceed our resources.
    resourceExceded: function(total, limit) {
        if (total > limit) {
            return (
            <div style={{ color: "red", marginTop: "-20px" }}>
                You do not have enough resources.
                <br/>
                <a className="btn btn-xs btn-default" style={{ margin: "5px 0 20px" }} onClick={this.props.onRequestResources}>Request more Resources</a>
            </div>
            )
        }
    },

    render: function() {
        let identityProvider = this.props.identityProvider;

        // Here we are declaring all of our variables that require 'if' check below before using our backbone methods.
        // If we don't have models yet, we still want to pass these empty declarations down to our child.
        // This is so we can render as much as posible to avoid the ui flashing as the models repopulate.

        // AU's Used
        let allocationConsumed,
            allocationTotal,
            allocationPercent,

            // Labels for bar graphs
            auLabel = "loading...";

        // Check if we have our models before using their backbone methods
        if (identityProvider) {

            // Calculate and set all of our graph information
            // AU's Used
            allocationConsumed = identityProvider.get("usage").current;
            allocationTotal = identityProvider.get("usage").threshold;
            allocationPercent = Math.round(allocationConsumed / allocationTotal * 100);

            // Labels for bar graphs
            auLabel = `You have used ${allocationPercent}% of ${allocationTotal} AU's from this provider`;
        }

        return (
        <div className="form-group">
            <label>
                AUs Consumed
            </label>
            <ProgressBar startColor="#56AA21" startValue={allocationPercent} label={auLabel} />
            {this.resourceExceded(allocationConsumed, allocationTotal)}
        </div>
        )
    },
});
