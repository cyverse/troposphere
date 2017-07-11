import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import $ from "jquery";
import Highcharts from "highcharts";
import ResourceUseTooltip from "./tooltips/ResourceUseTooltip";

/**
 * Finds a maximum within the data points for all identitys
 *
 * If the maximum does not exceed the _soft_ limit, `ceiling`, return
 * the greatest value present.
 *
 * @param {object} seriesData - array of identity's series data [1]
 * @param {int} ceiling - y Axis soft limit
 *
 * [1] http://api.highcharts.com/highcharts#plotOptions.series
 */
function findMaxDataPt(seriesData, ceiling) {
    // series data has an array of data points *per* identity
    // - we need to know the max value to set the Y Axis
    return Math.max(
        ceiling,
        Math.max(...seriesData.map(
            (identity) => Math.max(...identity.data))
        )
    );
}

export default React.createClass({
    displayName: "PercentageGraph",

    propTypes: {
        seriesData: React.PropTypes.array.isRequired,
        categories: React.PropTypes.array.isRequired
    },

    //
    // Mounting and State
    //

    componentDidMount: function() {
        var categories = this.props.categories;
        var seriesData = this.props.seriesData;

        var max = findMaxDataPt(seriesData, 100);

        var el = ReactDOM.findDOMNode(this);
        var $el = $(el);
        $el.removeClass("loading");

        if (seriesData.length === 0) {
            return;
        }
        var height = (categories.length * (seriesData.length * 50)) + 100;

        var plotLines = [],
            plotBands = [];

        if (max > 100) {
            plotLines = [{
                value: 100,
                color: "red",
                dashStyle: "shortdash",
                zIndex: 3,
                width: 3
            }];
            plotBands = [{
                color: "pink",
                from: 101,
                to: max + (max / 2)
            }];
        }

        // createChart is a CommonJS wrapping around Highcharts:
        // https://github.com/crealogix/highcharts-commonjs/blob/66df4da87c0c9ab389eb844b8fe737c8eb3e93b1/index.js#L6
        //
        // createChart(element, options, callback)
        // - `options` is the same as passing plotOptions to Highcharts.Chart
        new Highcharts.createChart(el, {
            chart: {
                type: "bar",
                backgroundColor: "transparent",
                height,
            },
            colors: [
                "#0098aa",
                "#56AA21",
                "#AD5527",
                "#5E8535",
                "#60646B",
                "#2F5494",
                "#C79730"
            ],
            credits: {
                enabled: false
            },
            title: {
                text: ""
            },
            xAxis: {
                type: "category",
                categories,
            },
            yAxis: {
                min: 0,
                max: max,
                plotLines,
                plotBands,
                title: {
                    text: "Percent of Allocation Used"
                }
            },

            tooltip: {
                shared: false,
                formatter: function(tooltip) {
                    var limits = this.series.options.limits;
                    var currentLimit = limits[this.x];
                    var currentUsage = currentLimit * this.y / 100;
                    var appendMessages = this.series.options.appendMessages;
                    var appendMessage = appendMessages[this.x];

                    var formatterComponent = (<ResourceUseTooltip resourceName={appendMessage} used={currentUsage} max={currentLimit} />);

                    return ReactDOMServer.renderToStaticMarkup(formatterComponent);
                }
            },
            legend: {
                verticalAlign: "top",
                align: "center"
            },
            series: seriesData
        });
    },

    componentDidUpdate: function() {
        this.componentDidMount();
    },

    //
    // Render
    //

    render: function() {
        return ( <div/> );
    }
});
