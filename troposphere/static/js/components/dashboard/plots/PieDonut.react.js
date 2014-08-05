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
        //provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        //sizes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      componentDidMount: function(){

        var colors = Highcharts.getOptions().colors,
          categories = ['MSIE', 'Firefox', 'Chrome', 'Safari'],
          name = 'Browser brands',
          data = [
            {
              y: 55.11,
              color: colors[0],
              drilldown: {
                name: 'MSIE versions',
                categories: ['MSIE 6.0', 'MSIE 7.0', 'MSIE 8.0', 'MSIE 9.0'],
                data: [10.85, 7.35, 33.06, 2.81],
                color: colors[0]
              }
            },
            {
              y: 21.63,
              color: colors[1],
              drilldown: {
                name: 'Firefox versions',
                categories: ['Firefox 2.0', 'Firefox 3.0', 'Firefox 3.5', 'Firefox 3.6', 'Firefox 4.0'],
                data: [0.20, 0.83, 1.58, 13.12, 5.43],
                color: colors[1]
              }
            },
            {
              y: 11.94,
              color: colors[2],
              drilldown: {
                name: 'Chrome versions',
                categories: ['Chrome 5.0', 'Chrome 6.0', 'Chrome 7.0', 'Chrome 8.0', 'Chrome 9.0',
                  'Chrome 10.0', 'Chrome 11.0', 'Chrome 12.0'],
                data: [0.12, 0.19, 0.12, 0.36, 0.32, 9.91, 0.50, 0.22],
                color: colors[2]
              }
            },
            {
              y: 7.15,
              color: colors[3],
              drilldown: {
                name: 'Safari versions',
                categories: ['Safari 5.0', 'Safari 4.0', 'Safari Win 5.0', 'Safari 4.1', 'Safari/Maxthon',
                  'Safari 3.1', 'Safari 4.1'],
                data: [4.55, 1.42, 0.23, 0.21, 0.20, 0.19, 0.14],
                color: colors[3]
              }
            }
          ];


        // Build the data arrays
        var browserData = [];
        for (var i = 0; i < data.length; i++) {

          // add browser data
//          browserData.push({
//            name: categories[i],
//            y: data[i].y,
//            color: data[i].color
//          });

          browserData.push([categories[i], data[i].y]);
        }

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
            text: 'Instances'
          },
          plotOptions: {
            pie: {
              innerSize: '40%'
            }
          },
          series: [
            {
              name: 'Browsers',
              data: browserData,
              size: '60%'
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
