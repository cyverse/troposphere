import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";
import moment from "moment";

import IdentityResource from "./IdentityResource";
import stores from "stores";


export default React.createClass({
    displayName: "Identity",

    propTypes: {
        identity: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        className: React.PropTypes.string,
    },

    componentDidMount: function() {
        stores.InstanceStore.addChangeListener(this.updateState);
        stores.VolumeStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.InstanceStore.removeChangeListener(this.updateState);
        stores.VolumeStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        this.forceUpdate();
    },

    render: function() {
        let identity = this.props.identity,
            provider,
            identityTitle,
            identityInstances,
            identityVolumes,
            identityCreationDate,
            numInstances = "-",
            numVolumes = "-";


        // only attempt to fetching identity metadata for persisted identities
        if (identity && identity.id && !identity.isNew()) {
            provider = identity.get('provider').name;
            identityTitle = identity.getName();
            identityCreationDate = moment(identity.get('start_date')).format("MMM D, YYYY hh:mm a");
            identityVolumes = stores.VolumeStore.getVolumesForIdentity(identity);
            identityInstances = stores.InstanceStore.getInstancesForIdentity(identity);
        } else {
            return (
                <li className={"col-md-4" + this.props.className} style={{padding: "15px"}}>
                    <div className="media card">
                        <h2 className="t-title">{identity.get('name') || '...'}</h2>
                        <div className="loading" style={{marginTop: "65px"}}/>
                    </div>
                </li>
            );
        }

        if (identityInstances && identityVolumes) {
            numInstances = identityInstances.length;
            numVolumes = identityVolumes.length;
        }

        return (
        <li className={"col-md-4" + this.props.className} style={{ padding: "15px" }}>
            <div className="media card">
                <Link to={`identities/${identity.id}/resources`} style={{ color: "inherit" }}>
                    <div style={{ "position": "relative" }}>
                        <div className="media__content">
                            <h2 className="t-title">{identityTitle}</h2>
                            <hr/>
                            <time className="t-caption" style={{ display: "block" }}>
                                {"Created on " + identityCreationDate}
                            </time>
                            <p className="t-caption" style={{ display: "block" }}>
                               {"Provider: "+ provider}
                            </p>
                        </div>
                        <div className="media__footer">
                            <ul className="identity-resource-list ">
                                <IdentityResource icon={"tasks"} count={numInstances} resourceType={"instances"} />
                                <IdentityResource icon={"hdd"} count={numVolumes} resourceType={"volumes"} />
                            </ul>
                        </div>
                    </div>
                </Link>
            </div>
        </li>
        );
    }
});
