import React from "react";

import ProjectDetailsView from "./detail/details/ProjectDetailsView";

import stores from "stores";


export default React.createClass({
    displayName: "ProjectDetailsPage",

    render() {
        let projectId = Number(this.props.params.projectId),
            project = stores.ProjectStore.get(projectId);

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
