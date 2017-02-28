import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";

import Glyphicon from "components/common/Glyphicon";

import modals from "modals";
import stores from "stores";


export default React.createClass({
    displayName: "SecondaryProjectNavigation",

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onDeleteProject: function(e) {
        e.preventDefault();

        var project = this.props.project,
            projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
            projectImages = stores.ProjectImageStore.getImagesCountFor(project),
            projectExternalLinks = stores.ProjectExternalLinkStore.getExternalLinksFor(project),
            projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project);

        if (projectInstances.length > 0
            || projectImages.length > 0
            || projectExternalLinks.length > 0
            || projectVolumes.length > 0) {
            modals.ProjectModals.explainProjectDeleteConditions();
        } else {
            modals.ProjectModals.destroy(project);
        }
    },

    renderRoute: function(name, linksTo, icon, params) {
        let { projectId } = params;
        return (
        <li key={name}>
            <Link to={`projects/${projectId}/${linksTo}`}
                  activeClassName="active">
                <Glyphicon name={icon} />
                <span>{name}</span>
            </Link>
        </li>
        )
    },

    render: function() {
        var project = this.props.project;

        return (
        <div>
            <div className="secondary-nav">
                <div className="container">
                    <ul className="secondary-nav-links">
                        {this.renderRoute("Resources", "resources", "th", {
                             projectId: project.id
                         })}
                        {this.renderRoute("Details", "details", "list-alt", {
                             projectId: project.id
                         })}
                    </ul>
                    <ul className="options-bar navbar-nav navbar-right">
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="glyphicon glyphicon-cog" /> Options <b className="caret"></b></a>
                            <ul className="dropdown-menu">
                                <li>
                                    <a href="#" className="danger" onClick={this.onDeleteProject}><i className="glyphicon glyphicon-trash" /> Delete Project</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="project-name container">
                <h1 className="t-display-1">{project.get("name")}</h1>
            </div>
        </div>
        );
    }
});
