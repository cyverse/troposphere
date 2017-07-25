import React from "react";
import { Link } from "react-router";

import Glyphicon from "components/common/Glyphicon";
import subscribe from "utilities/subscribe";


export default subscribe(React.createClass({
    displayName: "SecondaryAdminNav",

    props: {
        subscriptions: React.PropTypes.object.isRequired
    },

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

    requestPreview() {
        let { ResourceRequestStore } = this.props.subscriptions;
        let requests = ResourceRequestStore.findWhere({
            "status.name": "pending"
        });

        if (requests) {
            return `(${requests.length})`;
        }

        return "(...)";
    },

    render() {
        return (
        <div>
            <div className="secondary-nav">
                <div className="container">
                    <ul className="secondary-nav-links">
                        {this.renderRoute("Manage Users", "users", "user")}
                        {this.renderRoute("Manage Groups", "groups", "user")}
                        {this.renderRoute("Manage Accounts", "identities", "user")}
                        {this.renderRoute(
                            `Resource Requests ${ this.requestPreview() }`,
                            "resource-requests",
                            "tasks")}
                        {this.renderRoute("Imaging Requests", "imaging-requests", "floppy-disk")}
                    </ul>
                </div>
            </div>
        </div>
        );
    }
}), [ "ResourceRequestStore" ]);
