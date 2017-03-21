import React from "react";

import ProjectResourcesWrapper from "./detail/resources/ProjectResourcesWrapper";
import ExternalLinkDetailsView from "./resources/link/details/ExternalLinkDetailsView";

import stores from "stores";


export default React.createClass({
    displayName: "ExternalLinkDetailsPage",

    contextTypes: {
        projectId: React.PropTypes.number
    },

    render: function() {
        let projectId = this.context.projectId,
            project = stores.ProjectStore.get(projectId),
            linkId = this.props.params.linkId,
            link = stores.ExternalLinkStore.get(linkId);

        if (!project || !link) return <div className="loading"></div>;

        return (
        <ProjectResourcesWrapper project={project}>
            <ExternalLinkDetailsView project={project} link={link} />
        </ProjectResourcesWrapper>
        );
    }
});
