import React from "react";
import ReactDOM from "react-dom";
import RaisedButton from 'material-ui/RaisedButton';
import $ from "jquery";


export default React.createClass({
    displayName: "Button",

    propTypes: {
        isVisible: React.PropTypes.bool.isRequired,
        tooltip: React.PropTypes.string,
        onClick: React.PropTypes.func.isRequired,
        icon: React.PropTypes.string.isRequired,
        style: React.PropTypes.object
    },

    componentDidMount: function() {
        this.generateTooltip();
    },

    componentDidUpdate: function() {
        this.generateTooltip();
    },

    generateTooltip: function() {
        var el = ReactDOM.findDOMNode(this);
        var $el = $(el);
        $el.tooltip({
            title: this.props.tooltip
        });
    },

    onClick: function() {
        var el = ReactDOM.findDOMNode(this);
        var $el = $(el);
        //Manually hides tooltip to fix a bug when using modals
        //See: https://github.com/iPlantCollaborativeOpenSource/troposphere/pull/201
        $el.tooltip("hide");
        this.props.onClick();
    },

    render: function() {
        if (this.props.isVisible) {
            return (
            <RaisedButton
                style={{ ...this.props.style, marginLeft: "10px" }}
                onTouchTap={this.onClick}
            >
                <i className={"glyphicon glyphicon-" + this.props.icon} />
            </RaisedButton>
            );
        }
        return null;
    }
});
