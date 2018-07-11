import React from "react";

import SecondaryAdminNavigation from "./SecondaryAdminNavigation";

export default React.createClass({
    render: function() {
        return (
            <div>
                <SecondaryAdminNavigation />
                <div className="container admin">
                    <span className="adminHeader">
                        <h1 className="t-display-1">Admin</h1>
                        {this.props.children}
                    </span>
                </div>
            </div>
        );
    }
});
