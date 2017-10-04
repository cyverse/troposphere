import React from "react";

import context from "context";
import stores from "stores";

import ImageDetailsView from "./detail/ImageDetailsView";
import NotFoundPage from "components/NotFoundPage";

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
        stores.PatternMatchStore.addChangeListener(this.updateState);
        if (stores.ProviderStore) stores.ProviderStore.addChangeListener(this.updateState);
        if (stores.IdentityStore) stores.IdentityStore.addChangeListener(this.updateState);
    },

    componentWillUnmount() {
        stores.ImageStore.removeChangeListener(this.updateState);
        stores.ImageVersionStore.removeChangeListener(this.updateState);
        stores.TagStore.removeChangeListener(this.updateState);
        stores.PatternMatchStore.removeChangeListener(this.updateState);
        if (stores.ProviderStore) stores.ProviderStore.removeChangeListener(this.updateState);
        if (stores.IdentityStore) stores.IdentityStore.removeChangeListener(this.updateState);
    },

    renderBody: function() {
        var image = stores.ImageStore.getMaybe(Number(this.props.params.imageId)),
            tags = stores.TagStore.getAll(),
            allPatterns = stores.PatternMatchStore.getAll(),
            hasLoggedInUser = context.hasLoggedInUser(),
            providers = hasLoggedInUser ? stores.ProviderStore.getAll() : null,
            identities = hasLoggedInUser ? stores.IdentityStore.getAll() : null,
            requiredData = [image, tags];

        if (hasLoggedInUser) {
            requiredData.push(allPatterns);
        }

        if (!requiredData.every(obj => obj)) return <div className="loading"/>;

        if (image.status === 404) return (
            <NotFoundPage resource="image"/>
        );

        // If the user isn't logged in, display the public view, otherwise
        // wait for providers and instances to be fetched
        if (!hasLoggedInUser) {
            return (
            <ImageDetailsView image={image} tags={tags} allPatterns={allPatterns} />
            );
        }

        if (!providers || !identities) return <div className="loading"></div>;

        return (
        <ImageDetailsView image={image}
            providers={providers}
            identities={identities}
            allPatterns={allPatterns}
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
