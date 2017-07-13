import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
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

        // Highcharts is using DOM mutate here to render this chart.
        new Highcharts.createChart(el, {
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
