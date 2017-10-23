import React from "react";
import Backbone from "backbone";
import stores from "stores";
import ComponentProject from "./Project";


export default React.createClass({
    displayName: "ProjectList",

    propTypes: {
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        selectedProject: React.PropTypes.instanceOf(Backbone.Model),
        onProjectClicked: React.PropTypes.func
    },

    projectClicked: function(project) {
        return this.props.onProjectClicked(project);
    },
    renderSharedProject: function() {
        //Only show shared project when you have shared resources.
        let instances = stores.InstanceStore.getSharedInstances(),
            sharedProject = stores.ProjectStore.getSharedProject();
        if(!instances || instances.length == 0) {
            return null;
        }
        return (
        <ComponentProject key={sharedProject.id}
            project={sharedProject}
            projects={this.props.projects}
            onClick={self.projectClicked}
            className={""} />
        );
    },
    render: function() {
        var self = this,
            sharedProject = this.renderSharedProject(),
            projectListItems = this.props.projects.map(function(project) {
                var className;
                if (this.props.selectedProject && this.props.selectedProject == project) {
                    className = "active"
                } else {
                    className = ""
                }
                return (
                <ComponentProject key={project.id || project.cid}
                    project={project}
                    projects={this.props.projects}
                    onClick={self.projectClicked}
                    className={className} />
                );
            }.bind(this));

        if(sharedProject) {
            projectListItems.push(sharedProject)
        }

        return (
        <ul id="project-list" className="row">
            {projectListItems}
        </ul>
        );
    }
});
