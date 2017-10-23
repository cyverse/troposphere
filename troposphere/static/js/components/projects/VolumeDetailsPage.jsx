import React from "react";

import ProjectResourcesWrapper from "./detail/resources/ProjectResourcesWrapper";
import VolumeDetailsView from "./resources/volume/details/VolumeDetailsView";

import stores from "stores";


export default React.createClass({
    displayName: "VolumeDetailsPage",

    propTypes: {
        params: React.PropTypes.object
    },

    componentDidMount: function() {
        stores.ProjectStore.addChangeListener(this.updateState);
        stores.VolumeStore.addChangeListener(this.updateState);
        stores.HelpLinkStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ProjectStore.removeChangeListener(this.updateState);
        stores.VolumeStore.removeChangeListener(this.updateState);
        stores.HelpLinkStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        this.forceUpdate();
    },

    render() {
        let { projectId, volumeId } = this.props.params,
            volume = stores.VolumeStore.get(Number(volumeId)),
            helpLinks = stores.HelpLinkStore.getAll();
        let project;
        if(projectId == "shared") {
            project = stores.ProjectStore.getSharedProject();
        } else {
            project = stores.ProjectStore.get(Number(projectId));
        }

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
