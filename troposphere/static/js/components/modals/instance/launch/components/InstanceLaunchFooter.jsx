import React from "react";
import RaisedButton from 'material-ui/RaisedButton';

/**
 * "material-ui/RefreshIndicator" was not used because `top` & `left` position CSS
 * attributes were required; it seemed unlikely this was a good approach with the
 * faux "placeholder" -- @lenards (2017-08-21)
 */
const WaitingIndicator = React.createClass({
    render() {
        let style = {
            fontWeight: 500,
            fontSize: "14px",
            letterSpacing: "0px",
            textTransform: "uppercase",
            userSelect: "none",
            margin: "0px",
            paddingLeft: "6px",
            paddingRight: "16px",
            opacity: 1,
            color: "rgba(0, 0, 0, 0.87)"
        };
        return (
            <div style={{height: "36px"}} className="pull-right">
              <span style={{top: "5px"}} className="loading-tiny-inline" />
              <span style={style}>{"Launching ..."}</span>
            </div>
        );
    }
});


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
