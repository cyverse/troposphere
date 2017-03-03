import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import $ from "jquery";
import Highcharts from "highcharts";

export default React.createClass({
    displayName: "SparklineGraph",

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
        var height = 15;
        var width = 135;

        var plotLines = [],
            plotBands = [];
        var chart = new Highcharts.createChart(el, {
            chart: {
                backgroundColor: "transparent",
                margin:[0, 0, 0, 0],
                width,
                height,
            },
            credits: {
                enabled: false
            },
            title: {
                text: this.props.title,
            },
            xAxis: {
                labels:{
                    enabled:false
                }
            },
            yAxis: {
                maxPadding:0,
                minPadding:0,
                gridLineWidth: 0,
                endOnTick:false,
                labels:{
                    enabled:false
                }
            },
            legend:{
                enabled:false
            },
            tooltip:{
                enabled:false
            },
            plotOptions:{
                series:{
                    enableMouseTracking:false,
                    lineWidth:1,
                    shadow:false,
                    states:{
                        hover:{
                            lineWidth:1
                        }
                    },
                    marker:{
                        //enabled:false,
                        radius:0,
                        states:{
                            hover:{
                                radius:2
                            }
                        }
                    }
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


