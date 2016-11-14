import React from "react";
import ProjectResourcesWrapper from "./detail/resources/ProjectResourcesWrapper";
import ProjectDetails from "./detail/resources/ProjectDetails";
import stores from "stores";
import Router from "react-router";

export default React.createClass({
    displayName: "ProjectResouresPage",

    mixins: [Router.State],

    render: function() {
        var project = stores.ProjectStore.get(Number(this.getParams().projectId)),
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
