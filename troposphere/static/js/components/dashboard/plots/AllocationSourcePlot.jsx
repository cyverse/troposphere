import React from "react";

import PercentGraph from "components/common/ui/PercentageGraph";
import stores from "stores";
import globals from "globals";


export default React.createClass({
    displayName: "AllocationSourcePlot",

    updateState: function() {
        this.forceUpdate();
    },

    componentDidMount: function() {
        stores.AllocationSourceStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.AllocationSourceStore.addChangeListener(this.updateState);
    },

    seriesData: function(item) {
        let percentage = item.get("compute_used") / item.get("compute_allowed") * 100;
        return {
            name: item.get("name"),
            data: [percentage],
            limits: {
                Allocation: item.get("compute_allowed"),
            },
            appendMessages: {
                Allocation: globals.ALLOCATION_UNIT_ABBREV + 's'
            },
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                formatter: function() {
                    if (this.y != 0) {
                        return (Math.round(this.y * 100) / 100) + "%";
                    } else {
                        return '0%';
                    }
                }
            },
            animation: false
        }
    },

    //
    // Render
    //

    render: function() {
        let allocations = stores.AllocationSourceStore.getAll();
        if (!allocations) return <div className="loading" />;

        return (
        <div style={{ MarginBottom: "20px" }}>
            <h2 className="t-title">Allocation Source</h2>
            <PercentGraph seriesData={stores.AllocationSourceStore.getAll().map(this.seriesData)} categories={["Allocation"]} />
        </div>
        );
    }
});
