import React from "react";
import Backbone from "backbone";
import stores from "stores";


export default React.createClass({
    displayName: "AvailabilityView",

    propTypes: {
        version: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    renderProviderMachine: function(provider_machine) {
        // Hide 'end-dated' provider_machines
        let endDate = provider_machine.get("end_date");
        if (endDate && endDate.isValid()) return;

        return (
            <div key={provider_machine.get("id")}>
                {provider_machine.get("provider").name}
            </div>
        )
    },

    renderBody: function() {
        let machines = stores.ProviderMachineStore
            .getMachinesForVersion(this.props.version);

        if (!machines) return;

        return machines.map(this.renderProviderMachine);
    },

    render: function() {
        return (
        <div>
            <h4
                className="t-body-2"
                style={{ marginBottom: "5px" }}
            >
            Available on:
            </h4>
            {this.renderBody()}
        </div>
        );

    }
});
