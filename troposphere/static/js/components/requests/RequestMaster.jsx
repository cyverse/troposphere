import React from "react";
import SecondaryRequestNavigation from "./SecondaryRequestNavigation";
import Router from "react-router";


let RouteHandler = Router.RouteHandler;

export default React.createClass({
    displayName: "MyRequestsPage",

    mixins: [Router.State],

    render: function() {
        return (
        <div>
            <SecondaryRequestNavigation/>
            <div className="container admin">
                <span className="adminHeader"><RouteHandler /></span>
            </div>
        </div>
        );
    }
});
