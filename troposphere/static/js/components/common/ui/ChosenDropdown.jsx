import React from "react";
import classNames from "classnames";


export default React.createClass({
    displayName: "ChosenDropdown",

    propTypes: {
        value: React.PropTypes.string.isRequired,
        onSelected: React.PropTypes.func.isRequired,
        isMatch: React.PropTypes.bool,
    },

    getInitialState: function() {
        return {
            isMouseOver: false,
            isMatch: false
        }
    },

    onMouseEnter: function() {
        this.setState({
            isMouseOver: true
        })
    },

    onMouseLeave: function() {
        this.setState({
            isMouseOver: false
        })
    },

    render: function() {
        let { isMatch } = this.props,
            classes = classNames({
                "active-result": !isMatch,
                "highlighted": this.state.isMouseOver,
                "results-selected": isMatch
            });
        return (
        <li className={classes}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onClick={this.props.onSelected}>
            {this.props.value}
        </li>
        );
    }
});
