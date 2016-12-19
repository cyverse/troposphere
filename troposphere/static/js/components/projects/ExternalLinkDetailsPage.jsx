import React from "react";

import ProjectResourcesWrapper from "./detail/resources/ProjectResourcesWrapper";
import ExternalLinkDetailsView from "./resources/link/details/ExternalLinkDetailsView";

import stores from "stores";


export default React.createClass({
    displayName: "ExternalLinkDetailsPage",

    contextTypes: {
        params: React.PropTypes.object
    },

    render: function() {
        let project = stores.ProjectStore.get(Number(this.context.params.projectId)),
            linkId = this.context.params.linkId,
            link = stores.ExternalLinkStore.get(linkId);

        if (!project || !link) return <div className="loading"></div>;

        return (
        <ProjectResourcesWrapper project={project}>
            <ExternalLinkDetailsView project={project} link={link} />
        </ProjectResourcesWrapper>
        );
    }
});
