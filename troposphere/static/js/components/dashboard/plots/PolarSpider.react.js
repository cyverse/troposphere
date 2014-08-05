/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'jquery',

    // jquery plugins
    'highcharts'

  ],
  function (React, Backbone, $) {

    return React.createClass({

      propTypes: {
        //provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        //sizes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      componentDidMount: function(){
        console.log("component mounted!");

        var el = this.getDOMNode();
        var $el = $(el);
        $el.highcharts({
          chart: {
            polar: true,
            type: 'line'
          },
          title: {
            text: 'Budget vs spending',
            x: -80
          },
          pane: {
            size: '80%'
          },
          xAxis: {
            categories: ['Sales', 'Marketing', 'Development', 'Customer Support',
              'Information Technology', 'Administration'],
            tickmarkPlacement: 'on',
            lineWidth: 0
          },
          yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
          },
          tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
          },
          legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 70,
            layout: 'vertical'
          },
          series: [
            {
              name: 'Allocated Budget',
              data: [43000, 19000, 60000, 35000, 17000, 10000],
              pointPlacement: 'on'
            },
            {
              name: 'Actual Spending',
              data: [50000, 39000, 42000, 31000, 26000, 14000],
              pointPlacement: 'on'
            }
          ]
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
