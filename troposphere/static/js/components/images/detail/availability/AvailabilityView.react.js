import React from "react";
import Backbone from "backbone";
import stores from "stores";
import Code from "components/common/ui/Code.react.js";

export default React.createClass({
    displayName: "AvailabilityView",

    propTypes: {
        version: React.PropTypes
            .instanceOf( Backbone.Model ).isRequired
    },

    renderProviderMachine( provider ) {
        let { isSummary } = this.props;

        // Hide 'end-dated' provider_machines
        let endDate = provider( "end_date" );
        if (endDate && endDate.isValid()) return;

        // Assign strings for render
        let machineID = provider.get( "uuid" );
        let providerName = provider.get( "provider" ).name;

        // Optionally render the UUID if not set as
        // summary by parent
        let optMachineID = isSummary ? null
            : (
                <Code mb="10px" >
                    { machineID }
                </Code>
            );

        let key = `${providerName}-${machineID}`;
        return (
            <div key={ key }>
                { providerName }
                { optMachineID }
            </div>
        )
    },

    render() {
        let { version } = this.props;

        // Get providers this version is available on
        let machines = stores.ProviderMachineStore
            .getMachinesForVersion(version);

        // If there are any providers for this machine
        // map to render the list
        let providers = machines
            ? machines.map(this.renderProviderMachine)
            : null;

        return (
            <div>
                <h4
                    className="t-body-2"
                    style={{ marginBottom: "5px" }}
                >
                    Available on
                </h4>
                { providers }
            </div>
        );
    },
});
