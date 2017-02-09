import React from "react";
import Backbone from "backbone";

import VersionList from "./VersionList";

import context from "context";
import stores from "stores";


export default React.createClass({
    displayName: "VersionsView",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let image = this.props.image,
            versions = stores.ImageStore.getVersions(image.id),
            showAvailableOn = context.hasLoggedInUser(),
            versionElements = null;

        if (!versions) {
            return (<div className="loading" />);
        }

        if (versions.length > 0) {
            versionElements = (
            <div className="image-versions image-info-segment row">
                <h4 className="t-title">Versions</h4>
                <VersionList image={image}
                             versions={versions}
                             editable={true}
                             showAvailability={showAvailableOn} />
            </div>);
        }
        return (versionElements);
    }
});
