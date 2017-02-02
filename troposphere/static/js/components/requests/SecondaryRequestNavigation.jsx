import React from "react";
import { Link } from "react-router";
import Glyphicon from "components/common/Glyphicon";


export default React.createClass({
    displayName: "SecondaryRequestNav",


    renderRoute: function(name, linksTo, icon) {

        return (
        <li key={name}>
            <Link to={`my-requests/${linksTo}`}
                  activeClassName="active">
                <Glyphicon name={icon} />
                <span>{name}</span>
            </Link>
        </li>
        )
    },

    render: function() {
        return (
        <div>
            <div className="secondary-nav">
                <div className="container">
                    <ul className="secondary-nav-links">
                        {this.renderRoute("Resource Requests", "resources", "circle-arrow-up")}
                        {this.renderRoute("Imaging Requests", "images", "floppy-open")}
                    </ul>
                </div>
            </div>
        </div>
        );
    }
});
