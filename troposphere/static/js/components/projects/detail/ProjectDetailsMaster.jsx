import React from "react";

import SecondaryProjectNavigation from "../common/SecondaryProjectNavigation";
import stores from "stores";


export default React.createClass({
    displayName: "ProjectDetailsMaster",

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
        var project = stores.ProjectStore.get(Number(this.props.params.projectId));

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
