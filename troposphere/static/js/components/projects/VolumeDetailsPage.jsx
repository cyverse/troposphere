import React from "react";

import ProjectResourcesWrapper from "./detail/resources/ProjectResourcesWrapper";
import VolumeDetailsView from "./resources/volume/details/VolumeDetailsView";

import stores from "stores";


export default React.createClass({
    displayName: "VolumeDetailsPage",

    propTypes: {
        params: React.PropTypes.object
    },

    render() {
        let { params } = this.props,
            project = stores.ProjectStore.get(Number(params.projectId)),
            volume = stores.VolumeStore.get(Number(params.volumeId)),
            helpLinks = stores.HelpLinkStore.getAll();

        if (!project || !volume || !helpLinks) {
            return <div className="loading"></div>;
        }

        return (
        <ProjectResourcesWrapper project={project}>
            <VolumeDetailsView project={project} volume={volume} />
        </ProjectResourcesWrapper>
        );
    }

});
