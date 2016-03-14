import React from 'react';
import bootstrap from 'bootstrap';
import $ from 'jquery';

export default React.createClass({
    componentDidMount: function () {
       if (this.props.tooltip) {
            var el = this.getDOMNode(),
                $el = $(el);

            $el.tooltip(this.props.tooltip);
       }
    },

    onTouch: function() {
        this.setState({
            outline: "none"
        });
        this.props.onClick();
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

    style: function() {
        return ({
            ...this.props.style,
            outline: this.state.outline
        })
    },

    render: function () {
        // Expects default, primary, danger, etc..
        // Better name than level?
        let buttonType = this.props.buttonType;

        return (
            <button 
                type="button"
                disabled={this.props.isDisabled}
                className={`btn btn-${buttonType}`}
                onClick={this.onTouch}
                style={this.style}
            >
                {this.icon()}
                {` ${this.props.title}`}
            </button>
        )
    }
});
