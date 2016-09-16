import React from "react";
import Router from "react-router";
import Glyphicon from "components/common/Glyphicon.react";
import stores from "stores";
import globals from "globals";


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

    updateState() {
        this.forceUpdate();
    },

    componentDidMount() {
        stores.ResourceRequestStore.addChangeListener(this.updateState);
    },

    componentWillUnmount() {
        stores.ResourceRequestStore.removeChangeListener(this.updateState);
    },

    requestPreview() {
        let requests = stores.ResourceRequestStore.findWhere({
            "status.name": "pending"
        });

        if (requests) {
            return `(${requests.length})`;
        }

        return "(...)";
    },

    render() {

        let navLinks;
        if (globals.USE_ALLOCATION_SOURCES) {
            navLinks = [
                this.renderRoute("Manage Users", "atmosphere-user-manager", "user"),
                this.renderRoute("Manage Identities", "identity-membership-manager", "user"),
                this.renderRoute("Imaging Requests", "image-request-manager", "floppy-disk"),
            ]
        } else {
            navLinks = [
                this.renderRoute("Manage Users", "atmosphere-user-manager", "user"),
                this.renderRoute("Manage Identities", "identity-membership-manager", "user"),
                this.renderRoute(
                    `Resource Requests ${ this.requestPreview() }`,
                    "resource-request-manager",
                    "tasks"),
                this.renderRoute("Imaging Requests", "image-request-manager", "floppy-disk"),
            ]
        }

        return (
        <div>
            <div className="secondary-nav">
                <div className="container">
                    <ul className="secondary-nav-links">
                        {navLinks}
                    </ul>
                </div>
            </div>
        </div>
        );
    }
});
