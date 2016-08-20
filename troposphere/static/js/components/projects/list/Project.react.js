import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import Router from 'react-router';
import moment from 'moment';
import ProjectResource from './ProjectResource.react';

export default React.createClass({
    displayName: "Project",

    propTypes: {
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      className: React.PropTypes.string,
    },

    render: function () {
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

      if (project.id) {
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
        )
      }

      if (projectExternalLinks && projectInstances && projectVolumes && projectImages) {
          numInstances = projectInstances.length;
          numVolumes = projectVolumes.length;
          numImages = projectImages.length;
          numExternalLinks = projectExternalLinks.length;
      }
        return (
          <li className={"col-md-4" + this.props.className} style={{padding: "15px"}}>
            <div className="media card">
            <Router.Link to="project-resources"
              params={{projectId: project.id}}
              style={{color: "inherit"}}
            >
                <div style={{"position": "relative"}}>
                    <div className="media__content">
                        <h2 className="t-title">{project.get('name')}</h2>
                        <hr/>
                        <time className="t-caption" style={{display: "block"}}>{"Created " + projectCreationDate}</time>
                        <p className="description"
                        style={{minHeight: "200px"}}
                        >
                            {description}
                        </p>
                    </div>
                    <div className="media__footer">
                        <ul className="project-resource-list ">
                            <ProjectResource icon={"tasks"}
                                            count={numInstances}
                                            resourceType={"instances"}
                            />
                            <ProjectResource icon={"hdd"}
                                            count={numVolumes}
                                            resourceType={"volumes"}
                            />
                            <ProjectResource icon={"floppy-disk"}
                                            count={numImages}
                                            resourceType={"images"}
                            />
                            <ProjectResource icon={"globe"}
                                            count={numExternalLinks}
                                            resourceType={"links"}
                            />
                        </ul>
                    </div>
                </div>
            </Router.Link>
            </div>
          </li>
        );
    }
});
