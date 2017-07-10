import React from "react";
import Backbone from "backbone";

import PercentageGraph from "components/common/ui/PercentageGraph";

export default React.createClass({
    displayName: "ProviderSummaryLinePlot",

    propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        sizes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    //
    // Helper Methods
    // 

    getChartData: function() {
        var summaries = [];
        this.props.identities.map(function(identity) {
            var data = this.getDataForIdentity(identity);
            if (data) summaries.push(data);
        }.bind(this));

        return summaries;
    },

    getDataForIdentity: function(identity) {
        var provider = this.props.providers.get(identity.get("provider").id),
            sizes = this.props.sizes,
            instances = this.props.instances,
            volumes = this.props.volumes,
            quota = identity.get("quota");

        var providerInstances = this.getProviderInstances(instances, provider);
        var providerVolumes = this.getProviderVolumes(volumes, provider);

        // CPU Usage
        var cpuUsageStats = this.calculateCpuUsage(providerInstances, quota, sizes),
            cpuUsage = cpuUsageStats.percentUsed * 100;

        // Memory Usage
        var memoryUsageStats = this.calculateMemoryUsage(providerInstances, quota, sizes),
            memoryUsage = memoryUsageStats.percentUsed * 100;

        // Storage Usage
        var storageUsageStats = this.calculateStorageUsage(providerVolumes, quota),
            storageUsage = storageUsageStats.percentUsed * 100;

        // Volume Usage
        var volumeUsageStats = this.calculateStorageCountUsage(providerVolumes, quota),
            volumeUsage = volumeUsageStats.percentUsed * 100;

        var seriesData = {
            name: identity.getName(),
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
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                formatter: function() {
                    if (this.y != 0) {
                        return (Math.round(this.y * 100) / 100) + "%";
                    } else {
                        return "0%";
                    }
                }
            },
            animation: false
        };

        return seriesData;
    },

    getProviderInstances: function(instances, provider) {
        return instances.filter(function(instance) {
            return instance.get("identity").provider === provider.id;
        });
    },

    getProviderVolumes: function(volumes, provider) {
        return volumes.filter(function(volume) {
            return volume.get("identity").provider === provider.id;
        });
    },

    calculateCpuUsage: function(instances, quota, sizes) {
        var maxCpuCount = quota.cpu;

        var currentCpuCount = instances.reduce(function(memo, instance) {
            var size = sizes.get(instance.get("size").id);
            return memo + size.get("cpu");
        }.bind(this), 0);

        return {
            currentUsage: currentCpuCount,
            maxAllocation: maxCpuCount,
            percentUsed: currentCpuCount / maxCpuCount
        };
    },

    calculateMemoryUsage: function(instances, quota, sizes) {
        var maxMemory = quota.memory;

        var currentMemory = instances.reduce(function(memo, instance) {
            var size = sizes.get(instance.get("size").id);
            return memo + size.get("mem");
        }.bind(this), 0);

        return {
            currentUsage: currentMemory,
            maxAllocation: maxMemory,
            percentUsed: currentMemory / maxMemory
        };
    },

    calculateStorageUsage: function(volumes, quota) {
        var maxStorage = quota.storage;

        var currentStorage = volumes.reduce(function(memo, volume) {
            return memo + volume.get("size")
        }.bind(this), 0);

        return {
            currentUsage: currentStorage,
            maxAllocation: maxStorage,
            percentUsed: currentStorage / maxStorage
        };
    },

    calculateStorageCountUsage: function(volumes, quota) {
        var maxStorageCount = quota.storage_count;

        var currentStorageCount = volumes.reduce(function(memo, volume) {
            return memo + 1;
        }.bind(this), 0);

        return {
            currentUsage: currentStorageCount,
            maxAllocation: maxStorageCount,
            percentUsed: currentStorageCount / maxStorageCount
        };
    },

    calculateAllocationUsage: function(allocation) {
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

    render: function() {
        return (
        <div>
            <h2 className="t-title">Provider Resources</h2>
            <PercentageGraph seriesData={this.getChartData()} categories={["CPU", "Memory", "Storage", "Volumes"]} />
        </div>
        );
    }
});
