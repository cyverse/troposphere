import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";
import moment from "moment";
import featureFlags from "utilities/featureFlags";
import subscribe from "utilities/subscribe";
import ProjectResource from "./ProjectResource";
import stores from "stores";
import context from "context";


const Project = React.createClass({
    displayName: "Project",

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        className: React.PropTypes.string,
    },
    getLeaderNames: function(project) {
        if(!project) {
            return "";
        }
        let leader_list = project.get('leaders');

        if (!leader_list) {
            return "";
        }
        let username_list = leader_list.map(function(g) {return g.username});

        return username_list.join(", ");
    },
    getMemberNames: function(project) {
        if(!project) {
            return "";
        }
        let user_list = project.get('users'),
            username_list = user_list.map(function(g) {return g.username});

        return username_list.join(", ");
    },

    getOwnershipInfo: function(project) {
        let current_user = context.profile.get('username');

        if(!project) {
            return "";
        }

        let leader_list = project.get('leaders');
        if (!leader_list) {
            return "";
        }

        let is_leader = leader_list.some(function(user) {
            return current_user === user.username;
        });

        if(is_leader) {
            return "Project Owner";
        } else {
            return "Shared with you";
        }

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
    renderProjectOwner: function() {
        if (!featureFlags.hasProjectSharing()) {
            return ;
        }
        let project = this.props.project,
            projectOwner = project.get('owner').name;

            return (<p className="t-caption" style={{ display: "block" }}>
               {"Group: "+projectOwner}
            </p>);
    },
    renderProjectType: function() {
        if (!featureFlags.hasProjectSharing()) {
            return ;
        }
        let project = this.props.project,
            users = project.get('users'),
            isPrivate = (users.length == 1),
            projectType = (isPrivate) ? "Private Project" : "Shared Project";
            return (<p className="t-caption" style={{ display: "block" }}>
               {"Type: "+projectType}
            </p>);
    },
    renderProjectOwnershipInfo: function() {
        if (!featureFlags.hasProjectSharing()) {
            return ;
        }
        let project = this.props.project,
            projectOwnershipInfo = this.getOwnershipInfo(project);

        return (<p className="t-caption" style={{ display: "block" }}>
           {projectOwnershipInfo}
        </p>);
    },
    renderIdentityList: function() {
        if (!featureFlags.hasProjectSharing()) {
            return ;
        }

        let { IdentityStore } = this.props.subscriptions,
            project = this.props.project,
            group = project.get('owner'),
            current_user = context.profile.get('username'),
            ownedIdentityList = IdentityStore.getIdentitiesForGroup(group, current_user);

        if (!ownedIdentityList) {
            return ;
        }
        let ownedIdentityNames = ownedIdentityList.map(function(i) {return i.toString()});
        return (<p className="t-caption" style={{ display: "block" }}>
                   {"Access to Identity: "+ownedIdentityNames}
                </p>);
    },
    renderUserList: function() {
        if (!featureFlags.hasProjectSharing()) {
            return ;
        }

        let project = this.props.project,
            projectOwner = project.get('owner').name,
            projectUsernameList = this.getMemberNames(project),
            isPrivate = (projectOwner == context.profile.get('username'));
        if(isPrivate) {
            return ;
        }
        return (<p className="t-caption" style={{ display: "block" }}>
                   {"Users: "+projectUsernameList}
                </p>);
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
                                {"Created on " + projectCreationDate}
                            </time>
                            {this.renderProjectOwner()}
                            {this.renderProjectType()}
                            {this.renderProjectOwnershipInfo()}
                            {this.renderUserList()}
                            {this.renderIdentityList()}
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

export default subscribe(
    Project,
    ["IdentityStore"]);
