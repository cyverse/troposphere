import React from "react";
import Backbone from "backbone";


export default React.createClass({
    displayName: "IdentityResourcesWrapper",

    propTypes: {
        identity: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        children: React.PropTypes.element.isRequired
    },

    render: function() {
        return (
        <div className="container">
            <div className="td-identity-content">
                {this.props.children}
            </div>
        </div>
        );
    }

});
