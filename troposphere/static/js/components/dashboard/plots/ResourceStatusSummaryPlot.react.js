/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'jquery',

    // jquery plugins
    'highcharts'

  ],
  function (React, Backbone, $, Highcharts) {

    return React.createClass({

      propTypes: {
        title: React.PropTypes.string.isRequired,
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      componentDidMount: function(){
        this.appendPlot({animation: false});
      },

      componentDidUpdate: function(){
        var el = this.getDOMNode();
        var $el = $(el);
        var chart = $el.highcharts();

        var data = this.getChartData();

        chart.series[0].update({
          data: data,
          animation: false
        });
      },

      getChartData: function(){
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

      getStatusGroups: function(options){
        var statusGroups = {};
        this.props.resources.map(function (resource) {
          var status = resource.get('state').get('status_raw');
          statusGroups[status] = (statusGroups[status] || 0);
          statusGroups[status] += 1;
        }.bind(this));

        return statusGroups;
      },

      appendPlot: function(options){
        var data = this.getChartData();

        // Create the chart
        var el = this.getDOMNode();
        var $el = $(el);
        $el.highcharts({
          chart: {
            type: 'pie',
            backgroundColor:'transparent',
            height: 200
          },
          title:{
            text: this.props.title
          },
          plotOptions: {
            pie: {
              innerSize: '40%'
            }
          },
          series: [
            {
              name: 'Browsers',
              data: data,
              size: '60%',
              animation: options.animation
            }
          ],
          credits: {
            enabled: false
          }
        });
      },

      render: function () {
        return (
          <div>
          </div>
        );
      }

    });

  });
