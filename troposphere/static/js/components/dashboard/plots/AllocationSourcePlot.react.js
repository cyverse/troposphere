import React from "react";
import stores from 'stores';

import PercentGraph from 'components/common/ui/PercentageGraph.react';

export default React.createClass({
    displayName: "ProviderSummaryLinePlot",

    propTypes: {
    },

    seriesData: function(item) {
        let percentage = Math.round(item.get('compute_used') / item.get('compute_allowed') * 100);

        return {
            name: item.get('name'),
            data: [percentage],
            limits: {
                Allocation: item.get('compute_allowed'),
            },
            appendMessages: {
                Allocation: "AUs"
            },
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                formatter: function() {
                    if (this.y != 0) {
                        return (Math.round(this.y * 100) / 100) + '%';
                    } else {
                        return null;
                    }
                }
            },
            animation: false
        }
    },

    //
    // Render
    //

    render: function () {
        let AllocationList = stores.AllocationSourceStore.getAll();
        if (!AllocationList) return <div className="loading"/>;

        return (
            <div style={{MarginBottom: "20px"}}>
                <h2 className="t-title">
                    Allocation Source
                </h2>
                <PercentGraph
                    seriesData={ stores.AllocationSourceStore.getAll().map(this.seriesData) }
                    categories={[ 'Allocation' ]}
                />
            </div>
        );
    }
});
