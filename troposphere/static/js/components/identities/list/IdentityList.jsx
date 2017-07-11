import React from "react";
import Backbone from "backbone";

import Identity from "./Identity";


export default React.createClass({
    displayName: "IdentityList",

    propTypes: {
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        selectedIdentity: React.PropTypes.instanceOf(Backbone.Model),
        onIdentityClicked: React.PropTypes.func
    },

    identityClicked: function(identity) {
        return this.props.onIdentityClicked(identity);
    },
    render: function() {
        var self = this,
            identities = this.props.identities.map(function(identity) {
                var className;
                if (this.props.selectedIdentity && this.props.selectedIdentity == identity) {
                    className = "active"
                } else {
                    className = ""
                }
                return (
                <Identity key={identity.id || identity.cid}
                    identity={identity}
                    identities={this.props.identities}
                    onClick={self.identityClicked}
                    className={className} />
                );
            }.bind(this));

        return (
        <ul id="identity-list" className="row">
            {identities}
        </ul>
        );
    }
});
