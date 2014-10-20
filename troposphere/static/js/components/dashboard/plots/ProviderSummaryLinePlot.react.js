/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'jquery',
    'stores/SizeStore',
    './tooltips/ResourceUseTooltip.react',

    // jquery plugins
    'highcharts'
  ],
  function (React, Backbone, $, SizeStore, ResourceUseTooltip) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        isPolarPlot: React.PropTypes.bool
      },

      getProviderInstances: function(instances, provider){
        return instances.filter(function(instance){
          return instance.get('identity').provider === provider.id;
        });
      },

      getProviderVolumes: function(volumes, provider){
         return volumes.filter(function(volume){
          return volume.get('identity').provider === provider.id;
        });
      },

      calculateCpuUsage: function(instances, quota, sizes){
        var maxCpuCount = quota.cpu;

        var currentCpuCount = instances.reduce(function(memo, instance){
          var size = sizes.findWhere({alias: instance.get('size_alias')});
          return memo + size.get('cpu');
        }.bind(this), 0);

        return {
          currentUsage: currentCpuCount,
          maxAllocation: maxCpuCount,
          percentUsed: currentCpuCount/maxCpuCount
        };
      },

      calculateMemoryUsage: function(instances, quota, sizes){
        var maxMemory = quota.mem;

        var currentMemory = instances.reduce(function(memo, instance){
          var size = sizes.findWhere({alias: instance.get('size_alias')});
          return memo + size.get('mem');
        }.bind(this), 0);

        return {
          currentUsage: currentMemory,
          maxAllocation: maxMemory,
          percentUsed: currentMemory/maxMemory
        };
      },

      calculateStorageUsage: function(volumes, quota){
        var maxStorage = quota.storage;

        var currentStorage = volumes.reduce(function(memo, volume){
          return memo + volume.get('size')
        }.bind(this), 0);

        return {
          currentUsage: currentStorage,
          maxAllocation: maxStorage,
          percentUsed: currentStorage/maxStorage
        };
      },

      calculateStorageCountUsage: function(volumes, quota){
        var maxStorageCount = quota.storage_count;

        var currentStorageCount = volumes.reduce(function(memo, volume){
          return memo + 1;
        }.bind(this), 0);

        return {
          currentUsage: currentStorageCount,
          maxAllocation: maxStorageCount,
          percentUsed: currentStorageCount/maxStorageCount
        };
      },

      calculateAllocationUsage: function(quota){
        var maxAllocation = quota.allocation.threshold;
        var currentAllocation = quota.allocation.current;

        return {
          currentUsage: currentAllocation,
          maxAllocation: maxAllocation,
          percentUsed: currentAllocation/maxAllocation
        };
      },

      getDataForIdentity: function(identity){
        var providerId = identity.get("provider_id");
        var provider = this.props.providers.get(providerId);
        var quota = identity.get('quota');
        var sizes = SizeStore.getAllFor(provider.id, identity.id);

        if(sizes){
          var providerInstances = this.getProviderInstances(this.props.instances, provider);
          var providerVolumes = this.getProviderInstances(this.props.volumes, provider);

          // CPU Usage
          var cpuUsageStats = this.calculateCpuUsage(providerInstances, quota, sizes);
          var cpuUsage = cpuUsageStats.percentUsed*100;

          // Memory Usage
          var memoryUsageStats = this.calculateMemoryUsage(providerInstances, quota, sizes);
          var memoryUsage = memoryUsageStats.percentUsed*100;

          // Storage Usage
          var storageUsageStats = this.calculateStorageUsage(providerVolumes, quota);
          var storageUsage = storageUsageStats.percentUsed*100;

          // Volume Usage
          var volumeUsageStats = this.calculateStorageCountUsage(providerVolumes, quota);
          var volumeUsage = volumeUsageStats.percentUsed*100;

          // Allocation Usage
          var allocationUsageStats = this.calculateAllocationUsage(quota);
          var allocationUsage = allocationUsageStats.percentUsed*100;

          var seriesData = {
            name: provider.get('name'),
            data: [cpuUsage, memoryUsage, storageUsage, volumeUsage],
            limits: {
              CPU: cpuUsageStats.maxAllocation,
              Memory: memoryUsageStats.maxAllocation,
              Storage: storageUsageStats.maxAllocation,
              Volumes: volumeUsageStats.maxAllocation
            },
            appendMessages: {
              CPU: "CPUs",
              Memory: "GBs of Memory",
              Storage: "GBs of Storage",
              Volumes: "Volumes"
            },
            animation: false
          };

          if(allocationUsageStats.maxAllocation){
            seriesData.data.push(allocationUsage);
            seriesData.limits.Allocation = allocationUsageStats.maxAllocation;
            seriesData.appendMessages.Allocation = "AUs";
          }

          return seriesData;
        }
      },

      getChartData: function(){
        var summaries = [];
        this.props.identities.map(function(identity) {
          var data = this.getDataForIdentity(identity);
          if(data) summaries.push(data);
        }.bind(this));
        return summaries;
      },

      componentDidMount: function(){
        var categories = ['CPU', 'Memory', 'Storage', 'Volumes'];
        var seriesData = this.getChartData();
        if(seriesData.length > 0 && seriesData[0].limits.Allocation) {
          categories.push("Allocation");
        }

        var el = this.getDOMNode();
        var $el = $(el);
        $el.removeClass("loading");

        if(seriesData.length === 0) {
          $el.addClass("loading");
          return;
        }

        $el.highcharts({
          chart: {
            type: 'column',
            backgroundColor:'transparent',
            height: 400
          },
          colors: [
            '#0098aa',
            '#56AA21',
            '#AD5527',
            '#5E8535',
            '#60646B',
            '#2F5494',
            '#C79730'
          ],
          credits: {
            enabled: false
          },
          title: {
            text: ''
          },
          xAxis: {
            categories: categories
          },
          yAxis: {
            min: 0,
            max: 100,
            title: {
              text: 'Percent of Allocation Used'
            }
          },
          tooltip: {
            shared: false,
            formatter: function(tooltip){
              var limits = this.series.options.limits;
              var currentLimit = limits[this.x];
              var currentUsage = Math.round(currentLimit*this.y/100);
              var appendMessages = this.series.options.appendMessages;
              var appendMessage = appendMessages[this.x];

              var formatterComponent = ResourceUseTooltip({
                resourceName: appendMessage,
                used: currentUsage,
                max: currentLimit
              });

              return React.renderComponentToStaticMarkup(formatterComponent);
            }
          },
          legend: {
            verticalAlign: 'top',
            align: 'center'
          },
          series: seriesData
        });
      },

      componentDidUpdate: function(){
        // var el = this.getDOMNode();
        // var $el = $(el);
        // var chart = $el.highcharts();

        // var data = this.getChartData();

        // chart.series[0].update({
        //   data: data,
        //   animation: false
        // });

        this.componentDidMount();
      },

      render: function () {
        return (
          <div>
          </div>
        );
      }

    });

  });
