import React from "react";
import stores from "stores";
import Backbone from "backbone";
import PercentLineChart from "components/images/detail/stats/PercentLineChart";


export default React.createClass({
    displayName: "ImageStatsView",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    getInitialState() {
        return {
            activeChart: "Monthly",
         }
    },
    getChartData: function(labels, data) {
        var seriesData = [{
            name: "Success Percentage",
            data: data,
            borderWidth: 0,
            animation: false
        }];

        return seriesData;
    },
    renderChart: function(image) {
        if(this.state.activeChart == "Monthly") {
            return this.renderMonthlyChart(image);
        } else if(this.state.activeChart == "Weekly") {
            return this.renderWeeklyChart(image);
        } else if(this.state.activeChart == "Daily") {
            return this.renderDailyChart(image);
        } else {
            return this.renderMonthlyChart(image);
        }
    },
    renderDailyChart: function(image) {
        let image_metrics = stores.ImageMetricsStore.fetchWhere(
            {
                'page_size': 1000,
                'interval': 'daily',
            }
        );
        if(!image_metrics) {
            return (<div className="loading"/>);
        }
        debugger;
        let image_metric = image_metrics.get(image.id)
        if(!image_metric) {
            return (<div className="loading"/>);
        }
        let metrics = image_metric.get('metrics');
        return this.renderMetricsChart(image, metrics);
    },
    renderWeeklyChart: function(image) {
        let image_metrics = stores.ImageMetricsStore.fetchWhere(
            {
                'page_size': 1000,
                'interval': 'weekly',
            }
        );
        if(!image_metrics) {
            return (<div className="loading"/>);
        }
        let image_metric = image_metrics.get(image.id)
        if(!image_metric) {
            return (<div className="loading"/>);
        }
        let metrics = image_metric.get('metrics');
        return this.renderMetricsChart(image, metrics);
    },
    renderMonthlyChart: function(image) {
        let image_metric = stores.ImageMetricsStore.get(image.id);
        if(!image_metric) {
            return (<div className="loading"/>);
        }
        let metrics = image_metric.get('metrics');
        return this.renderMetricsChart(image, metrics);
    },
    renderMetricsChart: function(image, metrics) {
        if(!metrics || Object.keys(metrics).length <= 0) {
            return (
                <div>
                    {"No metrics available for image " + image.get('name')}
                </div>
            );
        }
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

    renderChartSelector: function(image) {
        return (<div id="controls" className="metrics breadcrumb">
                    {this.renderChartSelections(image)}
                </div>);
    },
    onChartSelected: function(e) {
        let selectedText = e.target.innerHTML;
        this.setState({activeChart: selectedText});
        console.log("New active chart: "+selectedText);
        return;
    },
    renderChartSelections: function() {
        let options = ["Daily", "Weekly", "Monthly"];
        let self = this;
        return options.map(function(opt) {
            let classes = (self.state.activeChart == opt) ? "active metrics" : "";
            return (<li id={"image-metrics-select-"+opt} key={"image-metrics-select-"+opt} className={classes} onClick={self.onChartSelected}><a>{opt}</a></li>);
            });
    },
    render: function() {
        var image = this.props.image,
            staff_user = stores.ProfileStore.get().get("is_staff");
        if (!staff_user) {
            return;
        }
        return (
        <div id="ImageMetrics" className="image-versions image-info-segment row">
            <h4 className="t-title">Image Statistics:</h4>
            {this.renderChartSelector(image)}
            {this.renderChart(image)}
        </div>
        );
    }
});
