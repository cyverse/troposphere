import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";

import Glyphicon from 'components/common/Glyphicon';
import Tooltip from "components/common/ui/Tooltip";


export default React.createClass({
    displayName: "Emulate",

    propTypes: {
        username: React.PropTypes.string.isRequired
    },

    componentDidMount() {
        this.generateTooltip();
    },

    componentDidUpdate() {
        this.generateTooltip();
    },

    generateTooltip() {
        let $el = $(ReactDOM.findDOMNode(this));
        $el.tooltip({
            title: "Emulate"
        });
    },

    onClick() {
        let $el = $(ReactDOM.findDOMNode(this));
        $el.tooltip("hide");
    },

    render() {
        let { username } = this.props;

        return (
        <a href={`emulate/${username}`} onClick={this.onClick()}>
            <Glyphicon name="sunglasses" />
        </a>
        );
    }

});
