import React from "react";
import { Link } from "react-router";

import Glyphicon from "components/common/Glyphicon";


export default React.createClass({
    displayName: "SecondaryAdminNav",


    renderRoute: function(name, linksTo, icon) {
        // TODO - consider passing in `admin/...` via props
        // with a defaultProps of "admin"
        return (
        <li key={name}>
            <Link to={`admin/${linksTo}`}
                  activeClassName="active">
                <Glyphicon name={icon} />
                <span>{name}</span>
            </Link>
        </li>
        )
    },

    render() {
        return (
        <div>
            <div className="secondary-nav">
                <div className="container">
                    <ul className="secondary-nav-links">
                        {this.renderRoute("Manage Users", "users", "user")}
                        {this.renderRoute("Manage Accounts", "identities", "user")}
                        {this.renderRoute("Imaging Requests", "imaging-requests", "floppy-disk")}
                    </ul>
                </div>
            </div>
        </div>
        );
    }
});
