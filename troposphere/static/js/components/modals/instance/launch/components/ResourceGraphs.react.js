import React from 'react';
import Backbone from 'backbone';
import ProgressBar from 'components/common/ui/ProgressBar.react';

export default React.createClass({
    propTypes: {
        onRequestResources: React.PropTypes.func,
        resourcesUsed: React.PropTypes.object,
        identityProvider: React.PropTypes.instanceOf(Backbone.Model),
        providerSize: React.PropTypes.instanceOf(Backbone.Model),
    },

    // This is what we show if the instance will exceed our resources.
    resourceExceded: function(total, limit) {
        if (total > limit) {
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
        let identityProvider = this.props.identityProvider;
        let size = this.props.providerSize;
        let resourcesUsed = this.props.resourcesUsed;

        // Here we are declaring all of our variables that require 'if' check below before using our backbone methods.
        // If we don't have models yet, we still want to pass these empty declarations down to our child.
        // This is so we can render as much as posible to avoid the ui flashing as the models repopulate.


        // CPU's have used + will use
         let allocationCpu,
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
         cpuLabel = "loading...",
         gbLabel = "loading...";

        // Check if we have our models before using their backbone methods
        if (identityProvider && size && resourcesUsed) {

            // Calculate and set all of our graph information

            // CPU's have used + will use
            allocationCpu = identityProvider.get('quota').cpu;
            cpuUsed = resourcesUsed.cpu;
            cpuWillUse = size.get('cpu');
            cpuWillTotal = cpuUsed + cpuWillUse;
            percentOfCpuUsed = Math.round(cpuUsed / allocationCpu * 100);
            percentOfCpuWillUse = Math.round(cpuWillUse / allocationCpu * 100);

            // Memory have used + will use
            allocationGb = identityProvider.get('quota').memory;
            gbUsed = resourcesUsed.mem / 1024;
            gbWillUse = size.get('mem');
            gbWillTotal = gbUsed + gbWillUse;
            percentOfGbUsed = Math.round(gbUsed / allocationGb * 100);
            percentOfGbWillUse = Math.round(gbWillUse / allocationGb *100);

            // Labels for bar graphs
            cpuLabel = `A total ${cpuWillTotal} of ${allocationCpu} alloted CPUs`;
            gbLabel = `A total ${Math.round(gbWillTotal * 100) / 100} of ${allocationGb} alloted GBs of Memory`;
        }

        return (
                <div className="form-group">
                    <label>Resources Instance will Use</label>
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
