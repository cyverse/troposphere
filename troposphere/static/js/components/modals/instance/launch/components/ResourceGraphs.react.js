import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import ProgressBar from 'components/common/ui/ProgressBar.react';

export default React.createClass({
    propTypes: {
        onRequestResources: React.PropTypes.func,
        resourcesUsed: React.PropTypes.object,
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
        if ( !identityProvider || !size ) { return ( <div/>); }

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
        let gbUsed = resourcesUsed.mem / 1000;
        let gbWillUse = size.attributes.mem;
        let gbWillTotal = gbUsed + gbWillUse;
        let percentOfGbUsed = Math.round(gbUsed / allocationGb * 100);
        let percentOfGbWillUse = Math.round(gbWillUse / allocationGb *100);

        // Labels for bar graphs
        let auLabel =  `You have used ${allocationPercent}% of ${allocationTotal} AU's from this provider`;
        let cpuLabel = `Will total ${cpuWillTotal} of ${allocationCpu} alloted CPUs`;
        let gbLabel = `Will total ${Math.round(gbWillTotal * 100) / 100} of ${allocationGb} alloted GBs of Memory`;

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
