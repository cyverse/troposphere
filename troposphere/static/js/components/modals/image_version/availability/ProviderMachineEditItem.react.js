define(function (require) {

    var _ = require('underscore'),
        React = require('react'),
        Backbone = require('backbone'),
        stores = require('stores'),
      moment = require('moment'),
        actions = require('actions');

    return React.createClass({
        displayName: "ProviderMachineEditItem",

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
          var end_date,
            now_time = moment(new Date()),
            new_value = !this.state.machineEnabled;
          if(new_value) {
            end_date = null;
          } else {
            end_date = now_time
          }
          //TODO: actions before setState?
          actions.ProviderMachineActions.update(this.props.provider_machine, {end_date: now_time});
          this.setState({end_date:now_time, machineEnabled: !this.state.machineEnabled})
          //TODO: Update the individual provider machine
          //TODO: Save and redraw
        },
        render: function () {
          var provider_machine = this.props.provider_machine,
              classes, availableText;
          //TODO: Stylize this component
          if (this.state.machineEnabled) {
            availableText = "Enabled";
            classes = "list-group-item";
          } else {
            availableText = "Disabled as of " + provider_machine.end_dat.format("MMM D, YYYY hh:MMa");
            classes = "list-group-item list-group-item-danger"
          }
            return (
                <li className={classes} key={provider_machine.provider.id}>
                  <div className="edit-machine-container">
                    <span>{provider_machine.provider.name}</span><span>|</span>
                    <span>{availableText}</span><span>|</span>
                    <span onClick={this.updateAvailability}>{"{Enable/Disable Button}"}</span>
                  </div>
                </li>
            )
        },
    });

});
