import React from 'react';
import bootstrap from 'bootstrap';
import $ from 'jquery';
import Tooltip from 'components/common/ui/Tooltip.react';

export default React.createClass({
    propTypes: {
        buttonType: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        isDisabled: React.PropTypes.bool,
        icon: React.PropTypes.string,
        onTouch: React.PropTypes.func,
        tooltip: React.PropTypes.string,
        style: React.PropTypes.object
    },

    getInitialState: function() {
        return({
            showTooltip: false
        });
    },

    showTooltip: function() {
        this.setState({
            showTooltip: true
        });
    },

    hideTooltip: function() {
        this.setState({
            showTooltip: false
        });
    },

    onMouseEnter: function() {
        if (!this.props.isDisabled) {
            this.showTooltip();
        }
    },

    onMouseLeave: function() {
        this.hideTooltip();
    },

    onTouch: function() {
        this.props.onTouch();
        setTimeout( ()=> this.hideTooltip(), 2000);
    },

    tooltip: function() {
        let tooltip = this.props.tooltip;
        if (!tooltip || !this.state.showTooltip) { return };

        return(
            <Tooltip message={tooltip} />
        )
    },

    icon: function() {
        let icon = this.props.icon;
        if (!icon) {
            return null
        }

        return (
            <i className={`glyphicon glyphicon-${icon}`} />
        )
    },

    render: function () {
        // Expects link, default, primary, danger, etc..
        let buttonType = this.props.buttonType;

        return (
            <div style={{
                    ...this.props.style,
                    position: "relative"
                }}
            >
                <button
                    type="button"
                    disabled={this.props.isDisabled}
                    className={`btn btn-${buttonType}`}
                    onClick={this.onTouch}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                >
                    {this.icon()}
                    {` ${this.props.title}`}
                </button>
                {this.tooltip()}
            </div>
        )
    }
});
