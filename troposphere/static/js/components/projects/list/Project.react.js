define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    stores = require('stores'),
    Router = require('react-router'),
    moment = require('moment'),
    Showdown = require('showdown'),
    ProjectResource = require('./ProjectResource.react');

  return React.createClass({

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
        <li className="project-card" className={this.props.className}>
          <Router.Link to="project-resources" params={{projectId: project.id}}>
            {this.renderBody()}
          </Router.Link>
        </li>);
    },
    renderForClick: function () {
      var project = this.props.project;
      return (
        <li className="project-card" className={this.props.className} onClick={this.clicked}>
          {this.renderBody()}
        </li>);
    },
    render: function () {
      var project = this.props.project,
        projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
        projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project);

      if (!project.id || !projectInstances || !projectVolumes) {
        return (
          <li>
            <a>
              <div>
                <h2>{project.get('name')}</h2>

                <div className="loading" style={{marginTop: "65px"}}/>
              </div>
            </a>
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
        converter = new Showdown.converter(),
        description = project.get('description'),
        descriptionHtml = converter.makeHtml(description),
        projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
        projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project),
        projectCreationDate = moment(project.get('start_date')).format("MMM D, YYYY");

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
                             count={0}
                             resourceType={"images"}
              />
          </ul>
        </div>
      );
    }
  });

});
