import React from "react";
import { Link } from "react-router";


export default React.createClass({
    displayName: "ProjectsBreadcrumb",

    propTypes: {
        breadcrumb: React.PropTypes.object.isRequired,
        isCurrentLocation: React.PropTypes.bool
    },

    render: function() {
        let breadcrumb = this.props.breadcrumb,
            link;

        if (this.props.isCurrentLocation) {
            return (
            <span>{breadcrumb.name}</span>
            );
        }

        link = (
            <Link to={breadcrumb.linksTo}>
                {breadcrumb.name}
            </Link>
        );

        return (
        <span className="breadcrumb">
            {link} <span>{" > "}</span>
        </span>
        );
    }
});
