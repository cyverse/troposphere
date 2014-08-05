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
            backgroundColor:'transparent'
          },
          title: {
              text: ''
          },
          xAxis: {
              categories: ['CPUs', 'Memory', 'Storage', 'Volumes']
          },
          yAxis: {
              title: {
                  text: 'Percent Used'
              },
              plotLines: [
                  {
                      value: 0,
                      width: 1,
                      color: '#808080'
                  }
              ],
              min: 0,
              max: 100
          },
          legend: {
              align: 'center',
              verticalAlign: 'top',
              borderWidth: 0
          },
          series: [
              {
                  name: 'Tucson-Cloud',
                  data: [7.0, 6.9, 9.5, 14.5]
              },
              {
                  name: 'Workshop-Cloud',
                  data: [0.8, 5.7, 11.3, 17.0]
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
