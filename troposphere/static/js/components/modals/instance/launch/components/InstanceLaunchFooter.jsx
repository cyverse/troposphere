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
            paddingLeft: "10px",
            paddingRight: "16px",
            opacity: 1,
            color: "rgba(0, 0, 0, 0.87)"
        };
        return (
            <div style={{height: "36px", display: "flex", alignItems: "center"}}
                 className="pull-right">
              <span className="loading-tiny-inline" />
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
               onClick={() => { if (!waitingOnLaunch) { this.props.viewAdvanced() } }}>
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
