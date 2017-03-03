import React from "react";
import stores from "stores";
import Backbone from "backbone";
import PercentLineChart from "components/images/detail/stats/PercentLineChart";


export default React.createClass({
    displayName: "ImageStatsView",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    getChartData: function(labels, data) {
        var seriesData = [{
            name: "Success Percentage",
            data: data,
            borderWidth: 0,
            animation: true
        }];

        return seriesData;
    },
    renderChart: function(image) {

        let image_metrics = stores.ImageMetricsStore.get(image.id);
        if(!image_metrics) {
            return (<div className="loading"/>);
        }
        let metrics = image_metrics.get('metrics');
        if(!metrics || Object.keys(metrics).length <= 1) {
            return (
                <div>
                    {"No metrics available for image" + image.get('name')}
                </div>
            );
        }
        //let labels = [];
        //for(var date_label in metrics) {
        //    //Current format '%X %x' -- 18:11:22 02/20/17
        //    //
        //    labels.push(date_label);
        //}
        let labels = Object.keys(metrics);
        let metrics_values = Object.values(metrics);
        let percentData = metrics_values.map(function(mv) { return 100*mv.active/mv.total });
        let chartOptions = {
            "responsive": true
        };
        let chartData = [
            {
                data: percentData,
                label: "Success Rate",
            }
        ];
        let seriesData = this.getChartData(labels, percentData);
        var metricsChart = (<PercentLineChart
                seriesData={seriesData}
                categories={labels}
                title={"Success Rate"}
            />);

        return (<div className="image-metrics-chart">
             {metricsChart}
         </div>);
    },
    componentDidMount: function() {
        stores.ImageMetricsStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ImageMetricsStore.removeChangeListener(this.updateState);
    },

    render: function() {
        var image = this.props.image;

        return (
        <div className="image-versions image-info-segment row">
            <h4 className="t-title">Image Statistics:</h4>
            {this.renderChart(image)}
        </div>
        );
    }
});
