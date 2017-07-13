import React from "react";
import Backbone from "backbone";

import PercentageGraph from "components/common/ui/PercentageGraph";

export default React.createClass({
    displayName: "ProviderAllocationPlot",

    propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
    },

    //
    // Helper Methods
    //

    getChartData: function() {
        var summaries = [];
        //FIXME: this chart will no longer show 'Usage per identity'. That referred to 'IDentity-specific allocation sources' which have since gone away.
        // this.props.identities.map(function(identity) {
        //     var data = this.getDataForIdentity(identity);
        //     if (data) summaries.push(data);
        // }.bind(this));
        return summaries;
    },

    getDataForIdentity: function(identity) {
        var allocation = identity.get("usage");

        // Allocation Usage
        var allocationUsageStats = this.calculateAllocationUsage(allocation),
            allocationUsage = allocationUsageStats.percentUsed * 100;

        var seriesData = {
            name: identity.getName(),
            data: [allocationUsage],
            limits: {
                Allocation: allocationUsageStats.maxAllocation
            },
            appendMessages: {
                Allocation: "AUs",
            },
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                formatter: function() {
                    if (this.y != 0) {
                        return (Math.round(this.y * 100) / 100) + '%';
                    } else {
                        return '0%';
                    }
                }
            },
            animation: false
        };

        return seriesData;
    },

    calculateAllocationUsage: function(allocation) {
        var maxAllocation = allocation.threshold;
        var currentAllocation = allocation.current;

        return {
            currentUsage: currentAllocation,
            maxAllocation: maxAllocation,
            percentUsed: currentAllocation / maxAllocation
        };
    },

    //
    // Render
    //

    render: function() {
        return (
        <div>
            <h2 className="t-title">Provider Allocation</h2>
            <PercentageGraph seriesData={this.getChartData()} categories={["Allocation"]} />
        </div>
        );
    }
});
