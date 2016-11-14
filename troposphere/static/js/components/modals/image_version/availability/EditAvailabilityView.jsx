import React from "react";
import Backbone from "backbone";
import ProviderMachineEditItem from "./ProviderMachineEditItem";
import stores from "stores";


export default React.createClass({
    displayName: "EditAvailabilityVersion",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        version: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    renderProviderMachineItem: function(provider_machine) {
        return (
        <ProviderMachineEditItem key={provider_machine.id} provider_machine={provider_machine} version={this.props.version} />
        )
    },
    render: function() {
        var version = this.props.version,
            provider_machines = stores.ProviderMachineStore.getMachinesForVersion(version);

        if (!provider_machines) {
            return (<div className="loading" />);
        }

        return (
        <div className="image-availability">
            <h4 className="t-title">Available on Providers:</h4>
            <div className="content">
                <ul className="list-group">
                    {provider_machines.map(this.renderProviderMachineItem)}
                </ul>
            </div>
        </div>
        );
    },
});
