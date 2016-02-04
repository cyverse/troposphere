import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import ProgressBar from 'components/common/ui/ProgressBar.react';

export default React.createClass({
    propTypes: {
        onRequestResources: React.PropTypes.func,
        resourcesUsed: React.PropTypes.object.isRequired,
        identityProvider: React.PropTypes.instanceOf(Backbone.Model),
        providerSize: React.PropTypes.instanceOf(Backbone.Model),
    },
    resourceExceded: function(total, limit) {
        if (total >= limit) {
            return (
                <div style={{color: "red", marginTop: "-20px"}}>
                    You do not have enough resources. <br/>
                    <a className="btn btn-xs btn-default"
                        style={{margin: "5px 0 20px"}}
                        onClick={this.props.onRequestResources}
                    >
                        Request more Resources
                    </a>
                </div>
            )
        }
    },

    render: function() {
        // Make sure stores are populated before rendering
        let identityProvider = this.props.identityProvider;
        let size = this.props.providerSize;
        
        // AU's Used
        let allocation, 
         allocationConsumed,
         allocationTotal,
         allocationRemaining,
         allocationPercent,

        // Get Resources object
         resourcesUsed,
        // CPU's have used + will use
         allocationCpu,
         cpuUsed,
         cpuWillUse,
         cpuWillTotal,
         percentOfCpuUsed,
         percentOfCpuWillUse,

        // Memory have used + will use
         allocationGb,
         gbUsed,
         gbWillUse,
         gbWillTotal,
         percentOfGbUsed,
         percentOfGbWillUse,

        // Labels for bar graphs
         auLabel = "loading...",
         cpuLabel = "loading...",
         gbLabel = "loading...";

        if ( identityProvider && size ) {

            // AU's Used
            allocation = identityProvider.attributes;
            allocationConsumed = allocation.usage.current;
            allocationTotal = allocation.usage.threshold;
            allocationRemaining = allocationTotal - allocationConsumed;
            allocationPercent = Math.round(allocationConsumed / allocationTotal * 100);

            // Get Resources object
            resourcesUsed = this.props.resourcesUsed;
            // CPU's have used + will use
            allocationCpu = allocation.quota.cpu;
            cpuUsed = resourcesUsed.cpu;
            cpuWillUse = size.attributes.cpu;
            cpuWillTotal = cpuUsed + cpuWillUse;
            percentOfCpuUsed = Math.round(cpuUsed / allocationCpu * 100);
            percentOfCpuWillUse = Math.round(cpuWillUse / allocationCpu * 100);

            // Memory have used + will use
            allocationGb = allocation.quota.memory;
            gbUsed = resourcesUsed.mem / 1000;
            gbWillUse = size.attributes.mem;
            gbWillTotal = gbUsed + gbWillUse;
            percentOfGbUsed = Math.round(gbUsed / allocationGb * 100);
            percentOfGbWillUse = Math.round(gbWillUse / allocationGb *100);
        }
        // Labels for bar graphs
        auLabel =  `You have used ${allocationPercent}% of ${allocationTotal} AU's from this provider`;
        cpuLabel = `Will total ${cpuWillTotal} of ${allocationCpu} alloted CPUs`;
        gbLabel = `Will total ${Math.round(gbWillTotal * 100) / 100} of ${allocationGb} alloted GBs of Memory`;

        return (
                <div className="form-group">
                    <label>Resources Instance will Use</label>
                    <ProgressBar
                        startColor="#56AA21"
                        startValue={allocationPercent}
                        label={auLabel}
                    />
                        {this.resourceExceded(allocationConsumed, allocationTotal)}
                    <ProgressBar
                        startColor="#56AA21"
                        startValue={percentOfCpuUsed}
                        afterValue={percentOfCpuWillUse}
                        label={cpuLabel}
                    />
                        {this.resourceExceded(cpuWillTotal, allocationCpu)}
                    <ProgressBar
                        startColor="#56AA21"
                        startValue={percentOfGbUsed}
                        afterValue={percentOfGbWillUse}
                        label={gbLabel}
                    />
                        {this.resourceExceded(gbWillTotal, allocationGb)}
                </div>
            )
    },
});
