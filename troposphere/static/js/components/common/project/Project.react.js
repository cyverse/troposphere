import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import Router from 'react-router';
import moment from 'moment';
import Showdown from 'showdown';
import ProjectResource from 'components/projects/list/ProjectResource.react';

export default React.createClass({
    displayName: "CommonProject",

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
      var project = this.props.project,
        renderClasses = this.props.className + "list-group-item";
      return (
        <li  className={"project-card " + this.props.className}>
          <Router.Link to="project-resources" params={{projectId: project.id}}>
            {this.renderBody()}
          </Router.Link>
        </li>);
    },
    renderForClick: function () {
      var project = this.props.project,
        renderClasses = this.props.className + "list-group-item";
      return (
        <li className={"project-card" + this.props.className} onClick={this.clicked}>
          {this.renderBody()}
        </li>);
    },
    renderLoading: function () {
      var project = this.props.project,
        loadingClasses = this.props.className;

      return (
        <li className={loadingClasses}>
          <h2>{project.get('name')}</h2>

          <div className="loading" style={{marginTop: "20px"}}/>
        </li>
      );
    },
    render: function () {
      var project = this.props.project,
        projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
        projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project);
      if (!project.id || !projectInstances || !projectVolumes) {
        return this.renderLoading();
      } else if (this.props.useRouter == false) {
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
        projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
        projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project),
        projectCreationDate = moment(project.get('start_date')).format("MMM D, YYYY hh:mm a");

      return (
        <div>
          <h2 style={{marginTop: "10px;"}}>{project.get('name')}</h2>

          <div>
            <time>{"Created " + projectCreationDate}</time>
          </div>
          <div>
            <ul className="small-project-resource-list">
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
        </div>
      );
    }
});
