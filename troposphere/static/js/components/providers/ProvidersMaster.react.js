import React from "react";
import Router from "react-router";

let RouteHandler = Router.RouteHandler;

export default React.createClass({
    displayName: "ProvidersMaster",

    render: function() {
        return (
        <section className="container provider-master">
            <RouteHandler/>
        </section>
        )
    }
});
