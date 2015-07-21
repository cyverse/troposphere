define(function (require) {

    var _ = require('underscore'),
        React = require('react'),
        Backbone = require('backbone'),
        stores = require('stores'),
        ProviderCollection = require('collections/ProviderCollection');

    return React.createClass({

        propTypes: {
            image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
            version: React.PropTypes.instanceOf(Backbone.Model).isRequired
        },
        getInitialState: function() {
            return {
              providerMachines: null,
            }
        },
        updateAvailability: function(e) {
          var checked = e.target.checked;
          //TODO: Figure out what provider machine changed
          //TODO: Update the individual provider machine
          //TODO: Save and redraw
        },

        renderProviderMachine: function (provider_machine) {
          var availableText = provider_machine.get('end_date') ? "Enabled" : "Disabled";
            return (
                <li key={provider_machine.get('provider').id}>
                  {provider_machine.get('provider').name}
                  <input type="checkbox" onChange={this.updateAvailability}>
                    {availableText}
                  </input>
                </li>
            )
        },
        render: function () {
            var version = this.props.version,
            provider_machines = stores.ImageVersionStore.getMachines(version);

            if (!provider_machines) {
                return (<div className="loading" />);
            }
            if(!this.state.providerMachines) {
              this.setState({providerMachines: provider_machines});
            }

            return (
                <div className='image-availability image-info-segment row'>
                    <h4 className="title col-md-2">Available on</h4>
                    <div className="content col-md-10">
                        <ul className="list-unstyled">
                          {provider_machines.map(this.renderProviderMachine)}
                        </ul>
                    </div>
                </div>
            );
        },
    });

});
