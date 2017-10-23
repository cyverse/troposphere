import React from "react";

import SecondaryProjectNavigation from "../common/SecondaryProjectNavigation";
import stores from "stores";


export default React.createClass({
    displayName: "ProjectDetailsMaster",

    getChildContext() {
        return { projectId: this.props.params.projectId };
    },

   childContextTypes: {
        projectId: React.PropTypes.string
    },

    updateState: function() {
        this.forceUpdate();
    },

    componentDidMount: function() {
        stores.ProjectStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ProjectStore.removeChangeListener(this.updateState);
    },

    render: function() {
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
            )
        }

        return (
        <div className="project-details">
            <SecondaryProjectNavigation project={project} currentRoute="todo-remove-this" />
            {this.props.children}
        </div>
        );
    }
});
