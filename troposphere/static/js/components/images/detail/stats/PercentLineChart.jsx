import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import Highcharts from "highcharts";


export default React.createClass({
    displayName: "PercentageGraph",

    propTypes: {
        seriesData: React.PropTypes.array.isRequired,
        title: React.PropTypes.string.isRequired,
        categories: React.PropTypes.array.isRequired
    },

    //
    // Mounting and State
    //

    componentDidMount: function() {
        var categories = this.props.categories;
        var seriesData = this.props.seriesData;

        //var max = findMaxDataPt(seriesData, 100);

        var el = ReactDOM.findDOMNode(this);
        var $el = $(el);
        $el.removeClass("loading");

        if (seriesData.length === 0) {
            return;
        }
        var height = 350;

        var plotLines = [],
            plotBands = [];

        new Highcharts.createChart(el, {
            chart: {
                type: "line",
                backgroundColor: "transparent",
                height,
            },
            credits: {
                enabled: false
            },
            title: {
                text: this.props.title,
            },
            xAxis: {
                type: "category",
                categories,
            },
            yAxis: {
                min: 0,
                max: 100,
                plotLines,
                plotBands,
                title: {
                    text: "Percentage"
                }
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
