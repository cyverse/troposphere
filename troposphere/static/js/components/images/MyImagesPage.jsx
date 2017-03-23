import React from "react";
import ImageCardList from "./list/list/ImageCardList";
import stores from "stores";


export default React.createClass({
    displayName: "MyImagesPage",

    componentDidMount: function() {
        stores.ProfileStore.addChangeListener(this.updateState);
        stores.ImageStore.addChangeListener(this.updateState);
        stores.TagStore.addChangeListener(this.updateState);
        stores.HelpLinkStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ProfileStore.removeChangeListener(this.updateState);
        stores.ImageStore.removeChangeListener(this.updateState);
        stores.TagStore.removeChangeListener(this.updateState);
        stores.HelpLinkStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        this.forceUpdate();
    },

    renderBody: function() {
        var profile = stores.ProfileStore.get(),
            images = stores.ImageStore.fetchWhere({
                created_by__username: profile.get("username")
            }),
            tags = stores.TagStore.getAll(),
            helpLinks = stores.HelpLinkStore.getAll(),
            imagingDocsUrl;

        if (!images || !tags || !helpLinks) {
            return <div className="loading"></div>;
        }

        imagingDocsUrl = stores.HelpLinkStore.get("request-image");

        if (images.length === 0) {
            return (
            <p>
                {"You have not created any images. To learn how to create an image, please refer to the "}
                <a href={imagingDocsUrl.get("href")} target="_blank">documentation on imaging</a>
                {"."}
            </p>
            );
        }

        return (
        <div>
            <p style={{ marginBottom: "16px" }}>
                {"Looking for more information about the imaging process? Check out the "}
                <a href={imagingDocsUrl.get("href")} target="_blank">documentation on imaging</a>.
            </p>
            <ImageCardList images={images} />
        </div>
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
