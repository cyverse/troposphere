import React from "react";
import RaisedButton from 'material-ui/RaisedButton';

export default React.createClass({
    displayName: "InstanceLaunchFooter",

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

    renderBack: function() {
        if (this.props.backIsDisabled) {
            return
        } else {
            return (
            <a className="btn btn-default pull-left" style={{ marginRight: "10px" }} onClick={this.props.onBack}><span className="glyphicon glyphicon-arrow-left" /> Back</a>
            )
        }
    },

    render: function() {
        let disable = false;
        let showValidationErr = this.props.showValidationErr;

        if (showValidationErr) {
            disable = this.props.launchIsDisabled;
        }
        return (
        <div className="modal-footer">
            {this.renderBack()}
            <a className="pull-left btn" disabled={this.props.advancedIsDisabled} onClick={this.props.viewAdvanced}>
                {this.advancedIcon()}
                {" Advanced Options"}
            </a>
            <RaisedButton
                primary
                disabled={disable}
                className="pull-right"
                onTouchTap={this.props.onSubmitLaunch}
                label="Launch Instance"
            />
            <RaisedButton
                className="pull-right"
                style={{ marginRight: "10px" }}
                onClick={this.props.onCancel}
                label="Cancel"
            />
        </div>
        )
    }
});
