import React from "react";
import Backbone from "backbone";

import ProgressBar from "components/common/ui/ProgressBar";

export default React.createClass({

    propTypes: {
        allocationSource: React.PropTypes.instanceOf(Backbone.Model),
    },

    // This is what we show if the instance will exceed our resources.
    resourceExceded: function(total, limit) {
        if (total > limit) {
            return (
            <div style={{ color: "red", marginTop: "-20px" }}>
                You do not have enough resources.
                <br/>
                <a className="btn btn-xs btn-default" style={{ margin: "5px 0 20px" }} onClick={() => console.warn("Implement mee...")}>Request more Resources</a>
            </div>
            )
        }
    },

    render: function() {
        let { allocationSource } = this.props;

        // Check if we have our models before using their backbone methods
        if (!allocationSource) {
            return (
            <span>Loading...</span>
            );
        }

        // Calculate and set all of our graph information
        // AU's Used
        let consumed = allocationSource.get("compute_used");
        let total = allocationSource.get("compute_allowed");
        let name = allocationSource.get("name");
        let percent = Math.round(consumed / total * 100);

        // Labels for bar graphs
        let auLabel = `${percent}% of ${total} Allocation from ${name}`;

        return (
        <div className="form-group">
            <label>
                Allocation Used
            </label>
            <ProgressBar startColor="#56AA21" startValue={percent} label={auLabel} />
            {this.resourceExceded(consumed, total)}
        </div>
        )
    },
});
