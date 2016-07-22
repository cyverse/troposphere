import React from "react";
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import PercentGraph from 'components/common/ui/PercentageGraph.react';

/**
 * Finds a maximum within the data points for all providers
 *
 * If the maximum does not exceed the _soft_ limit, `ceiling`, return
 * the greatest value present.
 *
 * @param {object} seriesData - array of provider's series data [1]
 * @param {int} ceiling - y Axis soft limit
 *
 * [1] http://api.highcharts.com/highcharts#plotOptions.series
 */
function findMaxDataPt(seriesData, ceiling) {
    // series data has an array of data points *per* provider
    // - we need to know the max value to set the Y Axis
    return Math.max(
        ceiling,
        Math.max(...seriesData.map(
            (provider) => Math.max(...provider.data))
        )
    );
}

export default React.createClass({
    displayName: "ProviderSummaryLinePlot",

    propTypes: {
    },

    seriesData: [
        {
            name: "Personal",
            data: [70],
            limits: {
                Allocation: 1000,
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
        },
        {
            name: "Metrognome",
            data: [75],
            limits: {
                Allocation: 100,
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
        },
    ],

    //
    // Render
    //

    render: function () {
        return (
            <div style={{MarginBottom: "20px"}}>
                <h2 className="t-title">
                    Allocation Source
                </h2>
                <PercentGraph
                    seriesData={ this.seriesData }
                    categories={[ 'Allocation' ]}
                />
            </div>
        );
    }
});
