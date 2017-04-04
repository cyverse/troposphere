import React from "react";

import PercentGraph from "components/common/ui/PercentageGraph";
import messages from "messages/allocationMessages";
import stores from "stores";


export default React.createClass({
    displayName: "AllocationSourcePlot",

    propTypes: {
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
                Allocation: messages.unitAbbrev
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
        let AllocationList = stores.AllocationSourceStore.getAll();
        if (!AllocationList) return <div className="loading" />;

        return (
        <div style={{ MarginBottom: "20px" }}>
            <h2 className="t-title">Allocation Source</h2>
            <PercentGraph seriesData={stores.AllocationSourceStore.getAll().map(this.seriesData)} categories={["Allocation"]} />
        </div>
        );
    }
});
