import React from "react";


export default React.createClass({
    displayName: "ProvidersMaster",

    render: function() {
        return (
        <section className="container provider-master">
            {this.props.children}
        </section>
        )
    }
});
