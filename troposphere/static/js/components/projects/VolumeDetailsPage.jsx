import React from "react";
import ProjectResourcesWrapper from "./detail/resources/ProjectResourcesWrapper";
import VolumeDetailsView from "./resources/volume/details/VolumeDetailsView";
import Router from "react-router";
import stores from "stores";

export default React.createClass({
    displayName: "VolumeDetailsPage",

    mixins: [Router.State],

    render: function() {
        var project = stores.ProjectStore.get(Number(this.getParams().projectId)),
            volume = stores.VolumeStore.get(Number(this.getParams().volumeId)),
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
