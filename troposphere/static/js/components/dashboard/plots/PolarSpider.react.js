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
        var barf = "yes";

        var el = this.getDOMNode();
        var $el = $(el);
        $el.highcharts({
          chart: {
            polar: true,
            type: 'line',
            backgroundColor:'transparent',
            height: 400
          },
          credits: {
            enabled: false
          },
          title: {
            text: 'Resource Consumption',
            x: -80
          },
          pane: {
            size: '80%'
          },
          xAxis: {
            categories: ['CPU', 'Memory', 'Storage', 'Volumes'],
            tickmarkPlacement: 'on',
            lineWidth: 0
          },
          yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
          },
          tooltip: {
            shared: false,
            //pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>',
            formatter: function(tooltip){
              var limits = this.series.options.limits;
              var currentLimit = limits[this.x];
              var currentUsage = Math.round(currentLimit*this.y);
              var appendMessages = this.series.options.appendMessages;
              var appendMessage = appendMessages[this.x];

              var component = React.createClass({
                render: function(){
                  // color:{series.color}
                  return (
                    <div>
                      <span style={{color: tooltip.options.style.color}}></span>
                      {"You are using " + currentUsage + " of " + currentLimit + " allotted " + appendMessage}
                    </div>
                  );
                }
              });
              var stuff = React.renderComponentToStaticMarkup(component());
              return stuff;
            },
            booyah: 1
          },
          legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 70,
            layout: 'vertical'
          },
          series: [
            {
              name: 'Tucson Cloud',
              data: [6/32, 24/64, 7/200, 7/8],
              pointPlacement: 'on',
              limits: {
                'CPU': 32,
                'Memory': 64,
                'Storage': 200,
                'Volumes': 8
              },
              appendMessages: {
                'CPU': "CPUs",
                'Memory': "GBs of Memory",
                'Storage': "GBs of Storage",
                'Volumes': "Volumes"
              }
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
