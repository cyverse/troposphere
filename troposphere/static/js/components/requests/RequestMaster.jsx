import React from "react";
import SecondaryRequestNavigation from "./SecondaryRequestNavigation";


export default React.createClass({
    displayName: "MyRequestsPage",

    render: function() {
        return (
        <div>
            <SecondaryRequestNavigation/>
            <div className="container admin">
                <span className="adminHeader">
                    {this.props.children}
                </span>
            </div>
        </div>
        );
    }
});
