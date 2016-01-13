import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import ProgressBar from 'components/common/ui/ProgressBar.react';

export default React.createClass({
    render: function() {

        // Make sure stores are populated before rendering
        let identityProvider = this.props.identityProvider;
        let size = this.props.size;

        if ( !identityProvider || !size ) { return ( <div className="loading"/> ); }

        // AU's Used
        let allocation = identityProvider.attributes;
        let allocationConsumed = allocation.usage.current;
        let allocationTotal = allocation.usage.threshold;
        let allocationRemaining = allocationTotal - allocationConsumed;
        let allocationPercent = Math.round(allocationConsumed / allocationTotal * 100);

        // Get Resources object
        let resourcesUsed = this.props.resourcesUsed;

        // CPU's have used + will use
        let allocationCpu = allocation.quota.cpu;
        let cpuUsed = resourcesUsed.cpu;
        let cpuWillUse = size.attributes.cpu;
        let cpuWillTotal = cpuUsed + cpuWillUse;
        let percentOfCpuUsed = Math.round(cpuUsed / allocationCpu * 100);
        let percentOfCpuWillUse = Math.round(cpuWillUse / allocationCpu * 100);
        // Memory have used + will use
        let allocationGb = allocation.quota.memory;
        let gbUsed = Math.round((resourcesUsed.mem / 1000) * 100) / 100;
        let gbWillUse = size.attributes.mem;
        let gbWillTotal = gbUsed + gbWillUse;
        let percentOfGbUsed = Math.round(gbUsed / allocationGb * 100);
        let percentOfGbWillUse = Math.round(gbWillUse / allocationGb *100);

        // Labels for bar graphs
        let auLabel =  `You have currently used ${allocationPercent}% of ${allocationTotal} AU's from this provider`;
        let cpuLabel = `Will total ${cpuWillTotal} of ${allocationCpu} alloted CPUs`;
        let gbLabel = `Will total ${gbWillTotal} of ${allocationGb} alloted GBs of Memory`;

        return (
                <div className="form-group">
                    <label>Resources Instance will Use</label>
                    <ProgressBar
                        startColor="#56AA21"
                        startValue={allocationPercent}
                        label={auLabel}/>
                    <ProgressBar
                        startColor="#56AA21"
                        startValue={percentOfCpuUsed}
                        afterValue={percentOfCpuWillUse}
                        label={cpuLabel}/>
                    <ProgressBar
                        startColor="#56AA21"
                        startValue={percentOfGbUsed}
                        afterValue={percentOfGbWillUse}
                        label={gbLabel}/>
                </div>
                )
    },
});
