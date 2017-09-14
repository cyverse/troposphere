import React from "react";
import Backbone from "backbone";
import stores from "stores";

export default React.createClass({
    displayName: "IdentitySelect",

    propTypes: {
        identityId: React.PropTypes.number,
        disabled: React.PropTypes.bool,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
    },

    getDefaultProps() {
        return {
            disabled: false
        }
    },

    getOptions: function() {
        var identityOptions = this.props.identities.map(function(identity) {
            var providerId = identity.get("provider").id;
            var provider = this.props.providers.get(providerId);
            var provider_name = provider.get("name");
            var isInMaintenance = stores.MaintenanceMessageStore.isProviderInMaintenance(providerId);
            if (isInMaintenance)
                provider_name += " (disabled - in maintenance)";
            return (
            <option key={identity.id} value={identity.id} disabled={isInMaintenance}>
                {provider_name}
            </option>
            );
        }.bind(this));

        return identityOptions;
    },

    render: function() {
        var options = this.getOptions();
        var identityId = (this.props.identityId !== null) ? this.props.identityId : this.props.identities.first().id;
        return (
        <select value={identityId}
            id="identity"
            className="form-control"
            disabled={this.props.disabled}
            onChange={this.props.onChange}>
            {options}
        </select>
        );
    }
});
