import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";

import Glyphicon from "components/common/Glyphicon";

import modals from "modals";
import stores from "stores";


export default React.createClass({
    displayName: "SecondaryIdentityNavigation",

    propTypes: {
        identity: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onDeleteIdentity: function(e) {
        e.preventDefault();

        var identity = this.props.identity,
            identityVolumes = stores.VolumeStore.getVolumesForIdentity(identity),
            identityInstances = stores.InstanceStore.getInstancesForIdentity(identity);

        if (identityInstances.length > 0
            || identityVolumes.length > 0) {
            modals.IdentityModals.explainIdentityDeleteConditions();
        } else {
            modals.IdentityModals.destroy(identity);
        }
    },

    renderRoute: function(name, linksTo, icon, params) {
        let { identityId } = params;
        return (
        <li key={name}>
            <Link to={`identities/${identityId}/${linksTo}`}
                  activeClassName="active">
                <Glyphicon name={icon} />
                <span>{name}</span>
            </Link>
        </li>
        )
    },

    render: function() {
        var identity = this.props.identity,
        identityTitle = identity.getName();

        return (
        <div>
            <div className="secondary-nav">
                <div className="container">
                    <ul className="secondary-nav-links">
                        {this.renderRoute("Resources", "resources", "th", {
                             identityId: identity.id
                         })}
                    </ul>
                </div>
            </div>
            <div className="identity-name container">
                <h1 className="t-display-1">{identityTitle}</h1>
            </div>
        </div>
        );
    }
});
