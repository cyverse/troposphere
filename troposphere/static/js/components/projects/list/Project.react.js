define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    stores = require('stores'),
    Router = require('react-router'),
    moment = require('moment'),
    Showdown = require('showdown'),
    ProjectResource = require('./ProjectResource.react');

  return React.createClass({
    displayName: "Project",

    propTypes: {
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onClick: React.PropTypes.func,
      className: React.PropTypes.string,
      useRouter: React.PropTypes.bool
    },
    clicked: function () {
      //Not required by default.. Add-on implementation.
      if (!this.props.onClick) {
        return;
      }
      return this.props.onClick(this.props.project);
    },
    renderForRouter: function () {
      var project = this.props.project;
      return (
        <li className={"col-md-4" + this.props.className} style={{padding: "15px"}}>
          <div className="media card">
            <Router.Link to="project-resources" 
              params={{projectId: project.id}}
              style={{color: "inherit"}}
            >
              {this.renderBody()}
            </Router.Link>
          </div>
        </li>);
    },
    renderForClick: function () {
      var project = this.props.project;
      return (
        <li className={"col-md-4" + this.props.className} style={{padding: "15px"}}>
          <div className="media card">
            {this.renderBody()}
          </div>
        </li>);
    },
    render: function () {
      var project = this.props.project,
        projectExternalLinks = stores.ProjectExternalLinkStore.getExternalLinksFor(project),
        projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
        projectImages = stores.ProjectImageStore.getImagesFor(project),
        projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project);

      if (!project.id || !projectExternalLinks || !projectInstances || !projectVolumes || !projectImages) {
        return (
        <li className={"col-md-4" + this.props.className} style={{padding: "15px"}}>
          <div className="media card">
                <h2 className="t-title">{project.get('name')}</h2>

                <div className="loading" style={{marginTop: "65px"}}/>
            </div>
          </li>
        );
      }

      if (this.props.useRouter == false) {
        return this.renderForClick();
      } else {
        return this.renderForRouter();
      }
    },
    renderBody: function () {
      var project = this.props.project,
        converter = new Showdown.Converter(),
        description = project.get('description'),
        descriptionHtml = converter.makeHtml(description),
        projectExternalLinks = stores.ProjectExternalLinkStore.getExternalLinksFor(project),
        projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
        projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project),
        projectImages = stores.ProjectImageStore.getImagesFor(project),
        projectCreationDate = moment(project.get('start_date')).format("MMM D, YYYY hh:mm a");

      return (
        <div style={{"position": "relative"}}>
          <div className="content">
            <h2>{project.get('name')}</h2>
            <time>{"Created " + projectCreationDate}</time>
            <div className="description" dangerouslySetInnerHTML={{__html: descriptionHtml}}/>
          </div>
          <ul className="project-resource-list">
            <ProjectResource icon={"tasks"}
                             count={projectInstances.length}
                             resourceType={"instances"}
              />
            <ProjectResource icon={"hdd"}
                             count={projectVolumes.length}
                             resourceType={"volumes"}
              />
            <ProjectResource icon={"floppy-disk"}
                             count={projectImages.length}
                             resourceType={"images"}
              />
            <ProjectResource icon={"globe"}
                             count={projectExternalLinks.length}
                             resourceType={"links"}
              />
          </ul>
        </div>
      );
    }
  });

});
