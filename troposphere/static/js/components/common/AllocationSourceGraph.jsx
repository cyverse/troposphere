import React from "react";
import Backbone from "backbone";

import ProgressBar from "components/common/ui/ProgressBar";
import modals from "modals";
import globals from "globals";


export default React.createClass({

    propTypes: {
        allocationSource: React.PropTypes.instanceOf(Backbone.Model),
    },

    onRequestResources() {
        modals.HelpModals.requestMoreResources(this);
    },

    // This is what we show if the instance will exceed our resources.
    resourceExceded: function(total, limit) {
        if (total >= limit) {
            return (
            <div style={{ color: "red", marginTop: "-20px" }}>
                {`You do not have enough ${globals.ALLOCATION_UNIT_NAME}s (${globals.ALLOCATION_UNIT_ABBREV}s).`}
                <br/>
                <a className="btn btn-xs btn-default"
                   style={{ margin: "5px 0 20px" }}
                   onClick={this.onRequestResources}>
                   { `Request additional ${globals.ALLOCATION_UNIT_NAME}s` }
                </a>
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
        // SU's Used
        let consumed = allocationSource.get("compute_used");
        let total = allocationSource.get("compute_allowed");
        let name = allocationSource.get("name");
        let percent = Math.round(consumed / total * 100);
        let unit = globals.ALLOCATION_UNIT_ABBREV;

        // Labels for bar graphs
        let auLabel = `${percent}% of ${total} ${unit}s from ${name}`;

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
