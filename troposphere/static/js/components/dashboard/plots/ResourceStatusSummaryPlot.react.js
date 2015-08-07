
define(function (require) {
    var React = require("react"),
        $ = require("jquery"),
        Backbone = require("backbone"),
        Highcharts = require("highcharts"),
        ResourceStatusTooltip= require("./tooltips/ResourceStatusTooltip.react");

    return React.createClass({
      getInitialState: function () {
          return  {
              chart: undefined
          };
      },

      propTypes: {
        title: React.PropTypes.string.isRequired,
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      componentDidMount: function () {
        this.appendPlot({animation: false});
      },

      componentDidUpdate: function () {
        var chart = this.state.chart
        var newChartTitle = this.props.resources.length + " " + this.props.title;
        var data = this.getChartData();
        chart.setTitle({text: newChartTitle});
        chart.series[0].update({
          data: data,
          animation: false
        });
      },

      getChartData: function () {
        var statusGroups = this.getStatusGroups();
        var categories = Object.keys(statusGroups);

        // Build the data arrays
        var data = [];
        for (var i = 0; i < categories.length; i++) {
          var category = categories[i];
          var count = statusGroups[category];
          data.push([category, count]);
        }

        return data;
      },

      getStatusGroups: function (options) {
        var statusGroups = {};
        this.props.resources.map(function (resource) {
          var status = resource.get('state').get('status_raw');
          statusGroups[status] = (statusGroups[status] || 0);
          statusGroups[status] += 1;
        }.bind(this));

        return statusGroups;
      },

      appendPlot: function (options) {
        var title = this.props.title;
        var data = this.getChartData();

        var formatterComponent = React.createClass({
          render: function () {

            return (
              <div>
                There are <b>{this.y}</b>{" " + title} with
                <br/>
                a status of <b>{this.key}</b>
              </div>
            );
          }
        });
        //var stuff = React.renderComponentToStaticMarkup(component());

        // Create the chart
        var el = this.getDOMNode();
        var chart = Highcharts.createChart(el, {
          chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            height: 200
          },
          title: {
            text: this.props.resources.length + " " + this.props.title
          },
          plotOptions: {
            pie: {
              innerSize: '40%',

              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false
              },
              showInLegend: true
            }
          },
          series: [
            {
              data: data,
              //size: '60%',
              animation: options.animation
            }
          ],
          tooltip: {
            formatter: function () {
              var formatterComponent = ResourceStatusTooltip({
                resourceName: title,
                status: this.key,
                count: this.y
              });
              return React.renderToStaticMarkup(formatterComponent);
            }
          },
          legend: {
            verticalAlign: 'top',
            align: 'center',
            y: 30
          },
          credits: {
            enabled: false
          }
        });
        this.setState({chart: chart});
      },

      render: function () {
        return (
          <div>
          </div>
        );
      }

    });

  });
