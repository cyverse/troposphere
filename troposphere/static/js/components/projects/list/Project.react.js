import React from 'react/addons';
import Backbone from 'backbone';
import stores from 'stores';
import Router from 'react-router';
import moment from 'moment';
import Showdown from 'showdown';
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
        converter = new Showdown.Converter(),
        projectExternalLinks,
        projectInstances,
        projectImages,
        projectVolumes,
        args,
        footer;

      if (project.id) {
        description = project.get('description');
        projectCreationDate = moment(project.get('start_date')).format("MMM D, YYYY hh:mm a");
        projectExternalLinks = stores.ProjectExternalLinkStore.getExternalLinksFor(project);
        projectInstances = stores.ProjectInstanceStore.getInstancesFor(project);
        projectImages = stores.ProjectImageStore.getImagesFor(project);
        projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project);
      }

      if (projectExternalLinks && projectInstances && projectVolumes && projectImages) {
        args = {
            projectExternalLinks,
            projectInstances,
            projectImages,
            projectVolumes,
        };
        footer = this.renderFooter(args)
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
                { footer }
                </div>
            </Router.Link>
            </div>
          </li>
        );
    },

    renderFooter: function (args) {
      var project = this.props.project;

      return (
                <div className="media__footer">
                    <ul className="project-resource-list ">
                        <ProjectResource icon={"tasks"}
                                        count={args.projectInstances.length}
                                        resourceType={"instances"}
                        />
                        <ProjectResource icon={"hdd"}
                                        count={args.projectVolumes.length}
                                        resourceType={"volumes"}
                        />
                        <ProjectResource icon={"floppy-disk"}
                                        count={args.projectImages.length}
                                        resourceType={"images"}
                        />
                        <ProjectResource icon={"globe"}
                                        count={args.projectExternalLinks.length}
                                        resourceType={"links"}
                        />
                    </ul>
                </div>
      );
    }
});
