import React from "react";

import ProjectResourcesWrapper from "./detail/resources/ProjectResourcesWrapper";
import SharedProjectView from "./detail/details/SharedProjectView";
import ProjectDetails from "./detail/resources/ProjectDetails";
import stores from "stores";



export default React.createClass({
    displayName: "ProjectResourcesPage",

    propTypes: {
        params: React.PropTypes.object
    },

    render: function() {
        let projectID = this.props.params.projectId,
            project, helpLinks;
        if (projectID == "shared") {
            return (
                <SharedProjectView />
            );
        }
        project = stores.ProjectStore.get(Number(projectID));
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
