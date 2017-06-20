import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import Tooltip from "react-tooltip";

import Glyphicon from 'components/common/Glyphicon';


export default React.createClass({
    displayName: "Emulate",

    propTypes: {
        username: React.PropTypes.string.isRequired
    },

    render() {
        let { username } = this.props;

        return (
        <a href={`emulate/${username}`}>
            <i className={"glyphicon glyphicon-user"}
               data-for={username}
               data-tip="Emulate"
               aria-hidden="true" />
            <Tooltip id={username}
                     place="top"
                     effect="solid" />
        </a>
        );
    }

});
