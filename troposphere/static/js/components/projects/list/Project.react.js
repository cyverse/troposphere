import React from "react";
import Backbone from "backbone";
import stores from "stores";
import Router from "react-router";
import moment from "moment";
import ProjectResource from "./ProjectResource.react";
import { MediaCard, Avatar } from 'cyverse-ui';
import { VolumeIcon, InstanceIcon, LinkIcon, ImageIcon } from 'cyverse-ui/icons';
export default React.createClass({
    displayName: "Project",

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        className: React.PropTypes.string,
    },

    render: function() {
        let style = this.style();

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
        } 

        if (projectExternalLinks && projectInstances && projectVolumes && projectImages) {
            numInstances = projectInstances.length;
            numVolumes = projectVolumes.length;
            numImages = projectImages.length;
            numExternalLinks = projectExternalLinks.length;
        }

        return (
            <Router.Link 
                to="project-resources" 
                params={{ projectId: project.id }} 
                style={{ color: "inherit" }}
            >
                <MediaCard
                    image={ 
                        <Avatar
                            size={ 35 }
                            name={ project.get('name') }
                        />
                    }
                    title={ project.get('name') }
                    subTitle={ "Created " + projectCreationDate }
                    summary={
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            { description }
                            <div style={{ display: "flex" }}>
                                <div style={ style.resource }>
                                    { numInstances } <InstanceIcon/> 
                                </div>
                                <div style={ style.resource }>
                                    { numVolumes } <VolumeIcon /> 
                                </div>
                                <div style={ style.resource }>
                                    { numImages } <ImageIcon />
                                </div>
                                <div style={ style.resource }>
                                    { numExternalLinks } <LinkIcon /> 
                                </div>
                            </div>
                        </div>
                    }
                    contextualMenu={[
                        {
                            render: "red"
                        }
                    ]}
                />
            </Router.Link>    
        );
    },
    
    style() {
        let style = {}
        style.resource = {
            marginRight: "20px"
        }

        return style
    }
});
