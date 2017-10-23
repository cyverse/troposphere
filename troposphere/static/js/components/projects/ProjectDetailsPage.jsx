import React from "react";

import ProjectDetailsView from "./detail/details/ProjectDetailsView";

import stores from "stores";


export default React.createClass({
    displayName: "ProjectDetailsPage",

    render() {
        let projectID = this.props.params.projectId,
            project;
        if (projectID == "shared") {
            project = stores.ProjectStore.getSharedProject();
        } else {
            project = stores.ProjectStore.get(Number(projectID));
        }

        if (!project) {
            return (
            <div className="loading"></div>
            );
        }

        return (
        <ProjectDetailsView project={project} />
        );
    }

});
