import React from "react";
import context from "context";
import Router from "react-router";
import stores from "stores";
import ImageDetailsView from "./detail/ImageDetailsView";

export default React.createClass({
    displayName: "ImageDetailsPage",

    mixins: [Router.State],

    renderBody: function() {
        var image = stores.ImageStore.get(Number(this.getParams().imageId)),
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
