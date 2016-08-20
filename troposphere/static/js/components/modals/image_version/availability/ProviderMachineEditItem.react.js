import React from 'react';
import Backbone from 'backbone';
import moment from 'moment';
import actions from 'actions';


export default React.createClass({
    displayName: "ProviderMachineEditItem",

    propTypes: {
        allow_edits: React.PropTypes.bool,
        provider_machine: React.PropTypes.object.isRequired,
        version: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getDefaultProps: function () {
        return {
            allow_edits: true,
        };
    },
    getInitialState: function() {
        let enabled,
        end_date = this.props.provider_machine.get('end_date');

        if (end_date && end_date.isValid()) {
            enabled = false;
        } else {
            enabled = true;
        }

        return {
            machineEnabled: enabled
        };
    },
    updateAvailability: function(e) {
      var end_date,
        now_time = moment(new Date()),
        isEnabled = !this.state.machineEnabled;
      if(isEnabled) {
        end_date = null;
      } else {
        end_date = now_time
      }

      actions.ProviderMachineActions.update(this.props.provider_machine, {end_date: end_date});
      this.setState({end_date: end_date, machineEnabled: isEnabled});
    },
    allow_edits: function() {
        return this.props.allow_edits;
    },
    render: function () {
      var provider_machine = this.props.provider_machine,
          provider = provider_machine.get('provider'),
          end_date = provider_machine.get('end_date'),
          classes, activateText, availableText, isDisabled;
      //TODO: Stylize this component
        if (this.state.machineEnabled == true) {
            availableText = "Enabled";
            activateText = "Disable Provider";
            classes = "list-group-item";
        } else {
            if(! end_date.isValid()) {
                availableText = "Archiving ...";
            } else {
                availableText = "Archived as of " +
                    end_date.format("MMM D, YYYY hh:mm a");
            }
            classes = "list-group-item list-group-item-danger";
            activateText = "Re-Enable Provider";
        }
        //NOTE: This may or may not be enabled for end users, depending on provider..
        isDisabled = (this.allow_edits() == false);
        //NOTE: Machines should be unique per provider..
        return (
            <li className={classes} key={provider.id}>
              <div className="container-fluid container-edit-provider-machine">
                <div className="col-sm-6" >{provider.name}</div>
                <div className="col-sm-3">{availableText}</div>
                <div className="col-sm-3">
                  <button className="btn btn-xs btn-primary"
                    style={{padding: "1px 5px"}}
                    onClick={this.updateAvailability}
                    disabled={isDisabled} >
                    {activateText}
                  </button>
                </div>
              </div>
            </li>
        )
    }
});
