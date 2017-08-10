import React from "react";
import { Link } from 'react-router';
import Tooltip from "react-tooltip";


export default React.createClass({
    displayName: "Emulate",

    propTypes: {
        username: React.PropTypes.string.isRequired
    },

    render() {
        let { username } = this.props;

        return (
        <Link to={`emulate/${username}`}
              activeClassName="active">
            <i className={"glyphicon glyphicon-user"}
               data-for={username}
               data-tip="Emulate"
               aria-hidden="true" />
            <Tooltip id={username}
                     place="top"
                     effect="solid" />
        </Link>
        );
    }

});
