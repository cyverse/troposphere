import React from "react";

import context from "context";
import stores from "stores";

import ImageDetailsView from "./detail/ImageDetailsView";

export default React.createClass({
    displayName: "ImageDetailsPage",

    updateState() {
        // TODO - probably need to do this differently :/
        this.forceUpdate(); // trigger a render ...
    },

    componentDidMount() {
        stores.ImageStore.addChangeListener(this.updateState);
        // ImageStore is calling out to ImageVersionStore (oddly enough ...)
        stores.ImageVersionStore.addChangeListener(this.updateState);
        stores.TagStore.addChangeListener(this.updateState);
        if (stores.ProviderStore) stores.ProviderStore.addChangeListener(this.updateState);
        if (stores.IdentityStore) stores.IdentityStore.addChangeListener(this.updateState);
    },

    componentWillUnmount() {
        stores.ImageStore.removeChangeListener(this.updateState);
        stores.ImageVersionStore.removeChangeListener(this.updateState);
        stores.TagStore.removeChangeListener(this.updateState);
        if (stores.ProviderStore) stores.ProviderStore.removeChangeListener(this.updateState);
        if (stores.IdentityStore) stores.IdentityStore.removeChangeListener(this.updateState);
    },

    renderBody: function() {
        var image = stores.ImageStore.get(Number(this.props.params.imageId)),
            tags = stores.TagStore.getAll(),
            hasLoggedInUser = context.hasLoggedInUser(),
            providers = hasLoggedInUser ? stores.ProviderStore.getAll() : null,
            identities = hasLoggedInUser ? stores.IdentityStore.getAll() : null;

        if (!image || !tags) return <div className="loading"></div>;

        // If the user isn't logged in, display the public view, otherwise
        // wait for providers and instances to be fetched
        if (!hasLoggedInUser) {
            return (
            <ImageDetailsView image={image} tags={tags} />
            );
        }

        if (!providers || !identities) return <div className="loading"></div>;

        return (
        <ImageDetailsView image={image}
            providers={providers}
            identities={identities}
            tags={tags} />
        );
    },

    render: function() {
        return (
        <div className="container">
            {this.renderBody()}
        </div>
        );
    }
});
