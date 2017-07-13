import React from "react";
import Backbone from "backbone";
import IdentityList from "./IdentityList";
import modals from "modals";
import IdentityListHeader from "../common/IdentityListHeader";


export default React.createClass({
    displayName: "IdentityListView",

    propTypes: {
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    launchNewIdentityModal: function() {
        modals.IdentityModals.create();
    },

    render: function() {
        return (
        <div>
            <IdentityListHeader title={this.props.identities.length + " Identities"}>
            </IdentityListHeader>
            <div className="container">
                <IdentityList identities={this.props.identities} />
            </div>
        </div>
        );
    }
});
