define(function (require) {

    var _ = require('underscore'),
        React = require('react'),
        Backbone = require('backbone'),
        stores = require('stores'),
      moment = require('moment'),
        actions = require('actions');

    return React.createClass({

        propTypes: {
            provider_machine: React.PropTypes.object.isRequired,
            version: React.PropTypes.instanceOf(Backbone.Model).isRequired
        },
        getInitialState: function() {
          return {
            machineEnabled: (this.props.provider_machine.end_date.isValid()) ? false : true,
          }
        },
        updateAvailability: function(e) {
          var checked = e.target.checked,
            now_time = moment(new Date);

          actions.ProviderMachineActions.update(this.props.provider_machine, {end_date: now_time});
          //TODO: Update the individual provider machine
          //TODO: Save and redraw
        },
        render: function () {
          var provider_machine = this.props.provider_machine,
              availableText = (this.state.machineEnabled) ? "Enabled" : "Disabled as of "+ provider_machine.end_date;
            return (
                <li key={provider_machine.provider.id}>
                  {provider_machine.provider.name}
                  <input type="checkbox" onChange={this.updateAvailability}>
                    {availableText}
                  </input>
                </li>
            )
        },
    });

});
