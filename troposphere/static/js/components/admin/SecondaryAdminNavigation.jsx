import React from "react";
import Router from "react-router";
import Glyphicon from "components/common/Glyphicon";


export default React.createClass({
    displayName: "SecondaryAdminNav",


    renderRoute: function(name, linksTo, icon) {

        return (
        <li key={name}>
            <Router.Link to={linksTo}>
                <Glyphicon name={icon} />
                <span>{name}</span>
            </Router.Link>
        </li>
        )
    },

    render() {
        return (
        <div>
            <div className="secondary-nav">
                <div className="container">
                    <ul className="secondary-nav-links">
                        {this.renderRoute("Manage Users", "atmosphere-user-manager", "user")}
                        {this.renderRoute("Manage Accounts", "identity-membership-manager", "user")}
                        {this.renderRoute("Imaging Requests", "image-request-manager", "floppy-disk")}
                    </ul>
                </div>
            </div>
        </div>
        );
    }
});
