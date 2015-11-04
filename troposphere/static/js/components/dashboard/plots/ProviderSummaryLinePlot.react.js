
define(function (require) {
    var React = require("react"),
        $ = require("jquery"),
        Backbone = require("backbone"),
        Highcharts = require("highcharts"),
        ResourceUseTooltip = require("./tooltips/ResourceUseTooltip.react");

    return React.createClass({
      displayName: "ProviderSummaryLinePlot",

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        sizes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      //
      // Mounting and State
      //

      componentDidMount: function () {
        var categories = ['CPU', 'Memory', 'Storage', 'Volumes'];
        var seriesData = this.getChartData();
        if (seriesData.length > 0 && seriesData[0].limits.Allocation) {
          categories.push("Allocation");
        }

        var el = this.getDOMNode();
        var $el = $(el);
        $el.removeClass("loading");

        if (seriesData.length === 0) {
          return;
        }

        new Highcharts.createChart(el, {
          chart: {
            type: 'column',
            backgroundColor: 'transparent',
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
            formatter: function (tooltip) {
              var limits = this.series.options.limits;
              var currentLimit = limits[this.x];
              var currentUsage = Math.round(currentLimit * this.y / 100);
              var appendMessages = this.series.options.appendMessages;
              var appendMessage = appendMessages[this.x];

              var formatterComponent = (<ResourceUseTooltip
                  resourceName={appendMessage}
                  used={currentUsage}
                  max={currentLimit}
                />);

              return React.renderToStaticMarkup(formatterComponent);
            }
          },
          legend: {
            verticalAlign: 'top',
            align: 'center'
          },
          series: seriesData
        });
      },

      componentDidUpdate: function () {
        this.componentDidMount();
      },

      //
      // Helper Methods
      //

      getChartData: function () {
        var summaries = [];
        this.props.identities.map(function (identity) {
          var data = this.getDataForIdentity(identity);
          if (data) summaries.push(data);
        }.bind(this));
        return summaries;
      },

      getDataForIdentity: function (identity) {
        var provider = this.props.providers.get(identity.get("provider").id),
            sizes = this.props.sizes,
            instances = this.props.instances,
            volumes = this.props.volumes,
            quota = identity.get('quota'),
            allocation = identity.get('usage');

        var providerInstances = this.getProviderInstances(instances, provider);
        var providerVolumes = this.getProviderVolumes(volumes, provider);

        // CPU Usage
        var cpuUsageStats = this.calculateCpuUsage(providerInstances, quota, sizes),
          cpuUsage = (cpuUsageStats.percentUsed * 100 > 100) ? 100 : cpuUsageStats.percentUsed * 100;

        // Memory Usage
        var memoryUsageStats = this.calculateMemoryUsage(providerInstances, quota, sizes),
          memoryUsage = (memoryUsageStats.percentUsed * 100 > 100) ? 100 : memoryUsageStats.percentUsed * 100;

        // Storage Usage
        var storageUsageStats = this.calculateStorageUsage(providerVolumes, quota),
          storageUsage = (storageUsageStats.percentUsed * 100 > 100) ? 100 : storageUsageStats.percentUsed * 100;

        // Volume Usage
        var volumeUsageStats = this.calculateStorageCountUsage(providerVolumes, quota),
          volumeUsage = (volumeUsageStats.percentUsed * 100 > 100) ? 100 : volumeUsageStats.percentUsed * 100;

        // Allocation Usage
        var allocationUsageStats = this.calculateAllocationUsage(allocation),
          allocationUsage = (allocationUsageStats.percentUsed * 100 > 100) ? 100 : allocationUsageStats.percentUsed * 100;

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

        if (allocationUsageStats.maxAllocation) {
          seriesData.data.push(allocationUsage);
          seriesData.limits.Allocation = allocationUsageStats.maxAllocation;
          seriesData.appendMessages.Allocation = "AUs";
        }

        return seriesData;
      },

      getProviderInstances: function (instances, provider) {
        return instances.filter(function (instance) {
          return instance.get('identity').provider === provider.id;
        });
      },

      getProviderVolumes: function (volumes, provider) {
        return volumes.filter(function (volume) {
          return volume.get('identity').provider === provider.id;
        });
      },

      calculateCpuUsage: function (instances, quota, sizes) {
        var maxCpuCount = quota.cpu;

        var currentCpuCount = instances.reduce(function (memo, instance) {
          var size = sizes.get(instance.get('size').id);
          return memo + size.get('cpu');
        }.bind(this), 0);

        return {
          currentUsage: currentCpuCount,
          maxAllocation: maxCpuCount,
          percentUsed: currentCpuCount / maxCpuCount
        };
      },

      calculateMemoryUsage: function (instances, quota, sizes) {
        var maxMemory = quota.memory;

        var currentMemory = instances.reduce(function (memo, instance) {
          var size = sizes.get(instance.get('size').id);
          return memo + size.get('mem');
        }.bind(this), 0);

        return {
          currentUsage: currentMemory,
          maxAllocation: maxMemory,
          percentUsed: currentMemory / maxMemory
        };
      },

      calculateStorageUsage: function (volumes, quota) {
        var maxStorage = quota.storage;

        var currentStorage = volumes.reduce(function (memo, volume) {
          return memo + volume.get('size')
        }.bind(this), 0);

        return {
          currentUsage: currentStorage,
          maxAllocation: maxStorage,
          percentUsed: currentStorage / maxStorage
        };
      },

      calculateStorageCountUsage: function (volumes, quota) {
        var maxStorageCount = quota.storage_count;

        var currentStorageCount = volumes.reduce(function (memo, volume) {
          return memo + 1;
        }.bind(this), 0);

        return {
          currentUsage: currentStorageCount,
          maxAllocation: maxStorageCount,
          percentUsed: currentStorageCount / maxStorageCount
        };
      },

      calculateAllocationUsage: function (allocation) {
        var maxAllocation = allocation.threshold;
        var currentAllocation = allocation.current;

        return {
          currentUsage: currentAllocation,
          maxAllocation: maxAllocation,
          percentUsed: currentAllocation / maxAllocation
        };
      },

      //
      // Render
      //

      render: function () {
        return (
          <div>
          </div>
        );
      }

    });

  });
