import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";
import moment from "moment";

import ProjectResource from "./ProjectResource";
import stores from "stores";


export default React.createClass({
    displayName: "Project",

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        className: React.PropTypes.string,
    },


    componentDidMount: function() {
        stores.ProjectExternalLinkStore.addChangeListener(this.updateState);
        stores.ProjectInstanceStore.addChangeListener(this.updateState);
        stores.ProjectImageStore.addChangeListener(this.updateState);
        stores.ProjectVolumeStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ProjectExternalLinkStore.removeChangeListener(this.updateState);
        stores.ProjectInstanceStore.removeChangeListener(this.updateState);
        stores.ProjectImageStore.removeChangeListener(this.updateState);
        stores.ProjectVolumeStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        this.forceUpdate();
    },

    render: function() {
        let project = this.props.project,
            description,
            projectCreationDate,
            projectExternalLinks,
            projectInstances,
            projectImages,
            projectVolumes,
            numInstances = "-",
            numVolumes = "-",
            numImages = "-",
            numExternalLinks = "-";


        // only attempt to fetching project metadata for persisted projects
        if (project && project.id && !project.isNew()) {
            description = project.get('description');
            projectCreationDate = moment(project.get('start_date')).format("MMM D, YYYY hh:mm a");
            projectExternalLinks = stores.ProjectExternalLinkStore.getExternalLinksFor(project);
            projectInstances = stores.ProjectInstanceStore.getInstancesFor(project);
            projectImages = stores.ProjectImageStore.getImagesFor(project);
            projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project);
        } else {
            return (
                <li className={"col-md-4" + this.props.className} style={{padding: "15px"}}>
                    <div className="media card">
                        <h2 className="t-title">{project.get('name') || '...'}</h2>
                        <div className="loading" style={{marginTop: "65px"}}/>
                    </div>
                </li>
            );
        }

        if (projectExternalLinks && projectInstances && projectVolumes && projectImages) {
            numInstances = projectInstances.length;
            numVolumes = projectVolumes.length;
            numImages = projectImages.length;
            numExternalLinks = projectExternalLinks.length;
        }

        return (
        <li className={"col-md-4" + this.props.className} style={{ padding: "15px" }}>
            <div className="media card">
                <Link to={`projects/${project.id}/resources`} style={{ color: "inherit" }}>
                    <div style={{ "position": "relative" }}>
                        <div className="media__content">
                            <h2 className="t-title">{project.get("name")}</h2>
                            <hr/>
                            <time className="t-caption" style={{ display: "block" }}>
                                {"Created " + projectCreationDate}
                            </time>
                            <p className="description" style={{ minHeight: "200px" }}>
                                {description}
                            </p>
                        </div>
                        <div className="media__footer">
                            <ul className="project-resource-list ">
                                <ProjectResource icon={"tasks"} count={numInstances} resourceType={"instances"} />
                                <ProjectResource icon={"hdd"} count={numVolumes} resourceType={"volumes"} />
                                <ProjectResource icon={"floppy-disk"} count={numImages} resourceType={"images"} />
                                <ProjectResource icon={"globe"} count={numExternalLinks} resourceType={"links"} />
                            </ul>
                        </div>
                    </div>
                </Link>
            </div>
        </li>
        );
    }
});
