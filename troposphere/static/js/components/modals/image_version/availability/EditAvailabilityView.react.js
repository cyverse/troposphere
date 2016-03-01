import _ from 'underscore';
import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import ProviderMachineEditItem from './ProviderMachineEditItem.react';

export default React.createClass({
    displayName: "EditAvailabilityVersion",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        version: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    renderProviderMachineItem: function (provider_machine) {
      var availableText = provider_machine.end_date ? "Enabled" : "Disabled";
        return (
            <ProviderMachineEditItem
              key={provider_machine.id}
              provider_machine={provider_machine}
              version={this.props.version}
            />
        )
    },
    render: function () {
        var version = this.props.version,
        provider_machines = stores.ImageVersionStore.getMachines(version.id);

        if (!provider_machines) {
            return (<div className="loading" />);
        }

        return (
            <div className='image-availability image-info-segment'>
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
