import React from "react";
import subscribe from "utilities/subscribe";
import Backbone from "backbone";
// import PercentLineChart from "components/images/detail/stats/PercentLineChart";


const ImageStatsView = React.createClass({
    displayName: "ImageStatsView",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    getInitialState() {
        return {
            activeChart: "Monthly",
            summaryData: null
         }
    },
    getChartData: function(labels, data) {
        var seriesData = [{
            name: "Success %",
            data: data,
            borderWidth: 0,
            animation: false
        }];
        if (this.state.summaryData != null) {
            seriesData.push({
                name: "Average Featured Success %",
                data: this.state.summaryData,
                borderWidth: 0,
                animation: false
            });
        }
        return seriesData;
    },
    /**
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
        let { ImageMetricsStore } = this.props.subscriptions;
        let image_metrics = ImageMetricsStore.fetchWhere(
            {
                'page_size': 1000,
                'interval': 'daily',
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
    renderWeeklyChart: function(image) {
        let { ImageMetricsStore } = this.props.subscriptions;
        let image_metrics = ImageMetricsStore.fetchWhere(
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
        let { ImageMetricsStore } = this.props.subscriptions;
        let image_metric = ImageMetricsStore.get(image.id);
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
    renderChartSelector: function(image) {
        return (<div id="controls" className="metrics breadcrumb">
                    {this.renderChartSelections(image)}
                </div>);
    },
    renderChartSelections: function() {
        let options = ["Daily", "Weekly", "Monthly"];
        let self = this;
        return options.map(function(opt) {
            let classes = (self.state.activeChart == opt) ? "active metrics" : "";
            return (<li id={"image-metrics-select-"+opt} key={"image-metrics-select-"+opt} className={classes} onClick={self.onChartSelected}><a>{opt}</a></li>);
            });
    },
    onChartSelected: function(e) {
        let { ImageMetricsStore } = this.props.subscriptions;
        let selectedText = e.target.innerHTML;
        let all_metrics;
        if (selectedText == "Monthly") {
            all_metrics = ImageMetricsStore.getAll();
        } else if(selectedText == "Daily") {
            all_metrics = ImageMetricsStore.fetchWhere({
                'page_size': 1000,
                'interval': 'daily',
            });
        } else if(selectedText == "Weekly") {
            all_metrics = ImageMetricsStore.fetchWhere({
                'page_size': 1000,
                'interval': 'weekly',
            });
        }
        var summaryData = this.state.summaryData;
        if (all_metrics != null) {
            summaryData = this.getSummaryData(all_metrics);
        }
        this.setState({
            activeChart: selectedText,
            metricsData: all_metrics,
            summaryData,
        });

        return;
    },
    getSummaryData: function(all_metrics) {
            let featured_metrics = all_metrics.filter(function(image_metric) { return image_metric.get('is_featured'); });
            let summary_series = [];

            featured_metrics.map(
                function(image_metric) {
                    var metrics = image_metric.get('metrics');
                    var labels = Object.keys(metrics);
                    var metrics_values = Object.values(metrics);
                    labels.map(function(datetime_key, index) {
                        let datetime_metrics = metrics_values[index];
                        if(summary_series.find(function(element) {
                            return element.key == datetime_key;
                        }) ) {
                            var idx = summary_series.findIndex(function(element) {
                                return element.key == datetime_key;
                            }); //Update values
                            let summary_metrics = summary_series[idx].value;
                            summary_metrics.active += datetime_metrics.active;
                            summary_metrics.total += datetime_metrics.total;
                        } else {
                            summary_series.push({'key': datetime_key, 'value': datetime_metrics});
                        }
                    });
                });
            let summaryData = summary_series.map(function(summary_obj) {
                let mv = summary_obj.value;
                return 100*mv.active/mv.total;
            });
            return summaryData;
    },
    componentDidMount: function() {
        let { ImageMetricsStore } = this.props.subscriptions;
        let all_metrics = ImageMetricsStore.getAll();
        let summaryData = this.state.summaryData;
        if (summaryData == null && all_metrics != null) {
            summaryData = this.getSummaryData(all_metrics);
        }
        this.setState({metricsData:all_metrics, summaryData});
    },
    */

    render: function() {
        let { ProfileStore, ImageMetricsStore } = this.props.subscriptions;
        var image = this.props.image,
            staff_user = ProfileStore.get().get("is_staff");

        if (!staff_user) {
            return null;
        }
        /** Time-series metrics and their Chart view have been disabled until further notice.
        let chartView = (
        <div id="ImageMetrics" className="image-versions image-info-segment row">
            <h4 className="t-title">Image Statistics:</h4>
            {this.renderChartSelector(image)}
            {this.renderChart(image)}
        </div>
        );
        */

        let imageMetric = ImageMetricsStore.get(image.id);
        if(!imageMetric) {
            return (<div className="loading"/>);
        }

        if(!imageMetric.hasMetrics()) {
            // Metrics unavailable//not-yet-generated for this image.
            return ;
        }

        let summarizedView = (
            <div id="ImageMetrics" className="image-versions image-info-segment row">
                <h4 className="t-title">Image Statistics</h4>
                <div>
                    <table className="clearfix table" style={{ tableLayout: "fixed" }}>
                        <thead>
                            <tr>
                                <th style={{ width: "400px"}}>Statistic</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                {"Number of Projects including this Application"}
                                </td>
                                <td>
                                {imageMetric.getProjectsTotal()}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                {"Number of users who Bookmarked this Application"}
                                </td>
                                <td>
                                {imageMetric.getBookmarksTotal()}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                {"Number of Applications based on this Application"}
                                </td>
                                <td>
                                {imageMetric.getApplicationForks()}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                {"Number of Instances Launched (Successful)"}
                                </td>
                                <td>
                                {imageMetric.getInstancesSuccess()}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                {"Number of Instances Launched (Total)"}
                                </td>
                                <td>
                                {imageMetric.getInstancesTotal()}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                {"Number of Instances Launched (%)"}
                                </td>
                                <td>
                                {imageMetric.getInstancesPercent()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );

        return summarizedView;
    }
});
export default subscribe(ImageStatsView, ["ImageMetricsStore", "ProfileStore"]);
