import React from "react";

import ProjectResourcesWrapper from "./detail/resources/ProjectResourcesWrapper";
import ProjectDetails from "./detail/resources/ProjectDetails";
import stores from "stores";



export default React.createClass({
    displayName: "ProjectResouresPage",

    contextTypes: {
        params: React.PropTypes.object
    },

    render: function() {
        let project = stores.ProjectStore.get(Number(this.context.params.projectId)),
            helpLinks = stores.HelpLinkStore.getAll();

        if (!project && !helpLinks) {
            return (
            <div className="loading"></div>
            );
        }

        return (
        <ProjectResourcesWrapper project={project}>
            <ProjectDetails project={project} />
        </ProjectResourcesWrapper>
        );
    }

});
