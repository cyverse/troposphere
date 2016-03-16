import React from 'react';

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

    hasAdvancedOptions: function() {
        if (!this.props.hasAdvancedOptions) { return }
        return (
            <span>
                <i className="glyphicon glyphicon-check" style={{color: "green"}}/>
                {" "}
            </span>
        )
    },

    renderBack: function() {
        if (this.props.backIsDisabled) {
            return
        }
        else {
            return (
                <a className="btn btn-default pull-left"
                    style={{marginRight:"10px"}}
                    onClick={this.props.onBack}
                >
                    <span className="glyphicon glyphicon-arrow-left"/> Back
                </a>
            )
        }
    },

    render: function() {
        let disable = false;
        let showValidationErr = this.props.showValidationErr;

        if  (showValidationErr) {
            disable = this.props.launchIsDisabled;
        }
        return (
            <div className="modal-footer">

                {this.renderBack()}
                <a className="pull-left btn"
                    disabled={this.props.advancedIsDisabled}
                    onClick={this.props.viewAdvanced}>
                        { this.hasAdvancedOptions() }
                        <i className="glyphicon glyphicon-cog"/>
                        {" Advanced Options"}
                </a>

                <button
                    disabled={disable}
                    type="button"
                    className="btn btn-primary pull-right"
                    onClick={this.props.onSubmitLaunch}
                >
                    Launch Instance
                </button>

                <button type="button"
                    className="btn btn-default pull-right"
                    style={{marginRight:"10px"}}
                    onClick={this.props.onCancel}
                >
                        Cancel
                </button>
            </div>
        )
    }
});
