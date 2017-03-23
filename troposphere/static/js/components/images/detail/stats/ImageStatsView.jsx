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

        let all_metrics = stores.ImageMetricsStore.getAll();
        let summaryData = this.state.summaryData;
        if (summaryData == null && all_metrics != null) {
            summaryData = this.getSummaryData(all_metrics);
        }
        this.setState({metricsData:all_metrics, summaryData});
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
        let all_metrics;
        if (selectedText == "Monthly") {
            all_metrics = stores.ImageMetricsStore.getAll();
        } else if(selectedText == "Daily") {
            all_metrics = stores.ImageMetricsStore.fetchWhere({
                'page_size': 1000,
                'interval': 'daily',
            });
        } else if(selectedText == "Weekly") {
            all_metrics = stores.ImageMetricsStore.fetchWhere({
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
    renderChartSelections: function() {
        let options = ["Daily", "Weekly", "Monthly"];
        let self = this;
        return options.map(function(opt) {
            let classes = (self.state.activeChart == opt) ? "active metrics" : "";
            return (<li id={"image-metrics-select-"+opt} key={"image-metrics-select-"+opt} className={classes} onClick={self.onChartSelected}><a>{opt}</a></li>);
            });
    },
    getSummaryData: function(all_metrics) {
            let featured_metrics = all_metrics.filter(function(image_metric) { return image_metric.get('is_featured'); });
            let featured_dataseries = featured_metrics.map(
                    function(image_metric) {
                        return image_metric.get('metrics')
                    }
                );
            let summary_series = [];
            // var aggregateSummary = null;
            // var summaryData2 = featured_dataseries.reduce(
            // function(aggregateSummary, metrics) {
            //     if(aggregateSummary == null) {
            //         aggregateSummary = metrics;
            //     }
            //     var labels = Object.keys(metrics);
            //     var metrics_values = Object.values(metrics);
            //     metrics_values.map(function(datetime_metrics, index) {
            //         let label = labels[index];
            //         let summary_metrics = aggregateSummary[label];
            //         summary_metrics.active += datetime_metrics.active;
            //         summary_metrics.total += datetime_metrics.total;
            //         aggregateSummary[label] = summary_metrics;
            //     });
            // });
            var featured_data = featured_metrics.map(
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
                //console.log(summary_obj.key);
                let mv = summary_obj.value;
                return 100*mv.active/mv.total;
             });
            return summaryData;
    },
    render: function() {
        var image = this.props.image,
            summary_data = {},
            staff_user = stores.ProfileStore.get().get("is_staff");
        if (!staff_user) {
            return null;
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
