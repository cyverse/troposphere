import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import WaitingIndicator from "components/common/ui/WaitingIndicator";


export default React.createClass({
    propTypes: {
        backIsDisabled: React.PropTypes.bool.isRequired,
        launchIsDisabled: React.PropTypes.bool.isRequired,
        advancedIsDisabled: React.PropTypes.bool.isRequired,
        viewAdvanced: React.PropTypes.func,
        onSubmitLaunch: React.PropTypes.func,
        onCancel: React.PropTypes.func,
        onBack: React.PropTypes.func,
    },

    advancedIcon: function() {
        if (!this.props.hasAdvancedOptions) {
            return (
            <span><i className="glyphicon glyphicon-cog"/> {" "}</span>
            )
        }
        return (
        <span><i className="glyphicon glyphicon-check" style={{ color: "green" }}/> {" "}</span>
        )
    },

    onAdvancedClick: function() {
        let { advancedIsDisabled,
              waitingOnLaunch,
              viewAdvanced } = this.props,
            canView = !(advancedIsDisabled || waitingOnLaunch);

        // when the modal is waiting on a launch, or the "advanced"
        // section has been actively disable, we cannot view
        if (canView && viewAdvanced) {
            viewAdvanced();
        }
    },

    renderBack: function() {
        let { backIsDisabled,
              waitingOnLaunch } = this.props;

        if (backIsDisabled) {
            return
        } else {
            return (
            <button className="btn btn-default pull-left"
                    style={{ marginRight: "10px" }}
                    disabled={waitingOnLaunch}
                    onClick={this.props.onBack}>
                <span className="glyphicon glyphicon-arrow-left" /> Back</button>
            )
        }
    },

    render: function() {
        let disable = false;
        let { showValidationErr,
              advancedIsDisabled,
              waitingOnLaunch } = this.props;

        if (showValidationErr) {
            disable = this.props.launchIsDisabled;
        }

        return (
        <div className="modal-footer">
            {this.renderBack()}
            <a className="pull-left btn"
               disabled={advancedIsDisabled || waitingOnLaunch}
               onClick={this.onAdvancedClick}>
                {this.advancedIcon()}
                {" Advanced Options"}
            </a>
            { !waitingOnLaunch ?
              <RaisedButton
                  primary
                  disabled={disable}
                  className="pull-right"
                  onTouchTap={this.props.onSubmitLaunch}
                  label="Launch Instance"
              /> : <WaitingIndicator /> }
            <RaisedButton
                className="pull-right"
                style={{ marginRight: "20px" }}
                onClick={this.props.onCancel}
                label={ !waitingOnLaunch ? "Cancel" : "Dismiss" }
            />
        </div>
        )
    }
});
