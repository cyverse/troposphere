import React from "react";
import Tooltip from "react-tooltip";


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
