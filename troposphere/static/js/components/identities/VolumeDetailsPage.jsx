import React from "react";

import IdentityResourcesWrapper from "./detail/resources/IdentityResourcesWrapper";
import VolumeDetailsView from "../projects/resources/volume/details/VolumeDetailsView";

import stores from "stores";


export default React.createClass({
    displayName: "VolumeDetailsPage",

    propTypes: {
        params: React.PropTypes.object
    },

    componentDidMount: function() {
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.VolumeStore.addChangeListener(this.updateState);
        stores.HelpLinkStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.VolumeStore.removeChangeListener(this.updateState);
        stores.HelpLinkStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        this.forceUpdate();
    },

    render() {
        let { params } = this.props,
            identity = stores.IdentityStore.get(Number(params.identityId)),
            volume = stores.VolumeStore.get(Number(params.volumeId)),
            helpLinks = stores.HelpLinkStore.getAll();

        if (!identity || !volume || !helpLinks) {
            return <div className="loading"></div>;
        }

        return (
        <IdentityResourcesWrapper identity={identity}>
            <VolumeDetailsView identity={identity} volume={volume} />
        </IdentityResourcesWrapper>
        );
    }

});
